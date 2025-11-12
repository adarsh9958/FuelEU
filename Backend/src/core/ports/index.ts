// Port interfaces for hexagonal architecture

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findByYear(year: number): Promise<Route[]>;
  updateBaseline(routeId: string): Promise<Route>;
  clearBaselines(): Promise<void>;
}

export interface ComplianceRepository {
  saveComplianceBalance(data: { shipId: string; year: number; cb_gco2eq: number }): Promise<void>;
  findLatestCB(shipId: string, year: number): Promise<number | null>;
}

export interface BankRepository {
  findEntries(shipId: string, year: number): Promise<BankEntry[]>;
  createEntry(data: { shipId: string; year: number; amount: number }): Promise<BankEntry>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
}

export interface PoolRepository {
  createPool(data: { year: number; members: PoolMemberData[] }): Promise<Pool>;
  findPoolsByYear(year: number): Promise<Pool[]>;
}

// Domain types
export interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption_t: number;
  distance_km: number;
  totalEmissions_t: number;
  isBaseline: boolean;
  createdAt: Date;
}

export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amount: number;
  createdAt: Date;
}

export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
  members: PoolMember[];
}

export interface PoolMember {
  id: number;
  poolId: number;
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface PoolMemberData {
  shipId: string;
  cb_before_g: number;
}

// Use case interfaces
export interface ComputeCBUseCase {
  execute(route: Route, targetIntensity?: number): CBResult;
}

export interface ComputeComparisonUseCase {
  execute(baseline: Route, comparisons: Route[]): ComparisonRow[];
}

export interface BankSurplusUseCase {
  execute(shipId: string, year: number): Promise<BankResult>;
}

export interface ApplyBankedUseCase {
  execute(shipId: string, year: number): Promise<ApplyResult>;
}

export interface CreatePoolUseCase {
  execute(year: number, members: PoolMemberData[]): Promise<Pool>;
}

// Result types
export interface CBResult {
  energyInScope_MJ: number;
  complianceBalance_gco2eq: number;
  status: 'surplus' | 'deficit';
}

export interface ComparisonRow {
  routeId: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export interface BankResult {
  message: string;
  amount_banked: number;
  entry: BankEntry;
}

export interface ApplyResult {
  shipId: string;
  year: number;
  cb_before_g: number;
  applied_g: number;
  cb_after_g: number;
  remaining_bank_g: number;
}
