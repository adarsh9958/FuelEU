import { Router } from "express";
import { prisma } from "../../../infrastructure/db/client.js";
import { computeCBForRoute } from "../../../core/application/computeCB.js";
import { computeComparison } from "../../../core/application/computeComparison.js";
import { createPoolGreedy } from "../../../core/application/pooling.js";

const router = Router();

// Routes

//middleware to log requests
router.use((req, _res, next) => {
  console.log(`[ROUTES] ${req.method} ${req.url}`);
  next();
});

router.get("/routes", async (_req, res) => res.json(await prisma.route.findMany()));

router.post("/routes/:routeId/baseline", async (req, res) => {
  const { routeId } = req.params;
  await prisma.route.updateMany({ where: {}, data: { isBaseline: false } });
  const updated = await prisma.route.update({ where: { routeId }, data: { isBaseline: true }});
  res.json(updated);
});

router.get("/routes/comparison", async (_req, res) => {
  const routes = await prisma.route.findMany();
  const baseline = routes.find((r: { isBaseline: any; }) => r.isBaseline);
  if (!baseline) return res.status(400).json({ error: "No baseline defined" });
  const rows = computeComparison(baseline, routes.filter((r: { routeId: any; })=>r.routeId!==baseline.routeId));
  res.json({ baseline, rows });
});

// Compliance
router.get("/compliance/cb", async (req, res) => {
  const shipId = String(req.query.shipId || "");
  if (!shipId) return res.status(400).json({ error: "shipId required" });
  const route = await prisma.route.findUnique({ where: { routeId: shipId }});
  if (!route) return res.status(404).json({ error: "route not found" });
  const target = Number(process.env.TARGET_INTENSITY ?? 89.3368);
  const cb = computeCBForRoute(route as any, target);
  await prisma.shipCompliance.create({ data: { shipId: route.routeId, year: route.year, cb_gco2eq: cb.complianceBalance_gco2eq }});
  res.json(cb);
});

router.post("/pools", async (req, res) => {
  const { year, members } = req.body as { year: number; members: { shipId: string; cb_before_g: number }[] };
  try {
    const out = createPoolGreedy(members);
    const pool = await prisma.pool.create({
      data: {
        year,
        members: { create: out.map(m => ({
          shipId: m.shipId,
          cb_before: members.find(x=>x.shipId===m.shipId)!.cb_before_g,
          cb_after: m.cb_after_g
        })) }
      },
      include: { members: true }
    });
    res.json(pool);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

// BANKING ENDPOINTS

// GET /banking/records?shipId=R001&year=2024
router.get("/banking/records", async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const entries = await prisma.bankEntry.findMany({
    where: { shipId: String(shipId), year: Number(year) },
    orderBy: { createdAt: "asc" }
  });

  const totalBanked = entries.reduce((sum: any, e: { amount: any; }) => sum + e.amount, 0);

  res.json({ totalBanked, entries });
});


// POST /banking/bank  { shipId, year }
router.post("/banking/bank", async (req, res) => {
  const { shipId, year } = req.body;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const route = await prisma.route.findUnique({ where: { routeId: shipId }});
  if (!route) return res.status(404).json({ error: "route not found" });

  // Calculate CB directly from route data
  const target = Number(process.env.TARGET_INTENSITY ?? 89.3368);
  const cbResult = computeCBForRoute(route as any, target);
  const cb = cbResult.complianceBalance_gco2eq;

  if (cb <= 0) return res.status(400).json({ error: "CB is not positive; cannot bank" });

  // Create bank entry with the surplus
  const entry = await prisma.bankEntry.create({
    data: { shipId, year: Number(year), amount: cb }
  });

  // Also store the compliance record for reference
  await prisma.shipCompliance.create({ 
    data: { shipId: route.routeId, year: Number(year), cb_gco2eq: cb }
  });

  res.json({ message: "Banked", amount_banked: cb, entry });
});


// POST /banking/apply  { shipId, year }
router.post("/banking/apply", async (req, res) => {
  const { shipId, year } = req.body;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const route = await prisma.route.findUnique({ where: { routeId: shipId }});
  if (!route) return res.status(404).json({ error: "route not found" });

  const target = Number(process.env.TARGET_INTENSITY ?? 89.3368);
  const cbCurrent = computeCBForRoute(route, target).complianceBalance_gco2eq;

  const entries = await prisma.bankEntry.findMany({
    where: { shipId, year: Number(year) },
    orderBy: { createdAt: "asc" }
  });
  const bankTotal = entries.reduce((sum: any, e: { amount: any; }) => sum + e.amount, 0);

  if (cbCurrent >= 0) return res.status(400).json({ error: "Ship has no deficit; nothing to apply" });
  if (bankTotal <= 0) return res.status(400).json({ error: "No banked surplus available" });

  const deficit = Math.abs(cbCurrent);
  const applyAmount = Math.min(bankTotal, deficit);

  // Store the application as a negative entry to reduce bank
  await prisma.bankEntry.create({
    data: { shipId, year: Number(year), amount: -applyAmount }
  });

  const cbAfter = cbCurrent + applyAmount;

  res.json({
    shipId,
    year,
    cb_before_g: cbCurrent,
    applied_g: applyAmount,
    cb_after_g: cbAfter,
    remaining_bank_g: bankTotal - applyAmount
  });
});


// GET /compliance/adjusted-cb?year=2024&shipId=R001
router.get("/compliance/adjusted-cb", async (req, res) => {
  const { year, shipId } = req.query;
  if (!year) return res.status(400).json({ error: "year required" });

  const y = Number(year);

  // Build where clause - filter by year and optionally by shipId
  const whereClause: any = { year: y };
  if (shipId) {
    whereClause.routeId = String(shipId);
  }

  const routes = await prisma.route.findMany({ where: whereClause });
  if (!routes.length) return res.json([]);

  const target = Number(process.env.TARGET_INTENSITY ?? 89.3368);
  const results = [];

  for (const route of routes) {
    // Current CB
    const baseCB = computeCBForRoute(route, target).complianceBalance_gco2eq;

    // Total banked adjustments from bank_entries
    const entries = await prisma.bankEntry.findMany({
      where: { shipId: route.routeId, year: y }
    });
    const bankTotal = entries.reduce((sum: any, e: { amount: any; }) => sum + e.amount, 0);

    results.push({
      shipId: route.routeId,
      year: y,
      cb_before_g: baseCB + bankTotal // adjusted CB
    });
  }

  res.json(results);
});


export default router;
