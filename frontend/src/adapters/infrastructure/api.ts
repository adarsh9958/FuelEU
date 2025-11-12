// Infrastructure adapter - implements outbound ports using axios
import axios from "axios";
import type {
  IRouteRepository,
  IComplianceRepository,
  IBankingRepository,
  IPoolRepository,
} from "../../core/ports";
import type {
  Route,
  ComparisonResult,
  ComplianceBalance,
  BankingRecord,
  Pool,
  AdjustedCBMember,
} from "../../core/domain/types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Route Repository Implementation
export class RouteRepository implements IRouteRepository {
  async getAllRoutes(): Promise<Route[]> {
    const response = await api.get<Route[]>("/routes");
    return response.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await api.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult> {
    const response = await api.get<ComparisonResult>("/routes/comparison");
    return response.data;
  }
}

// Compliance Repository Implementation
export class ComplianceRepository implements IComplianceRepository {
  async getComplianceBalance(routeId: string): Promise<ComplianceBalance> {
    const response = await api.get<ComplianceBalance>(
      `/compliance/cb?shipId=${routeId}`
    );
    return response.data;
  }

  async getAdjustedCB(year: string): Promise<AdjustedCBMember[]> {
    const response = await api.get<AdjustedCBMember[]>(
      `/compliance/adjusted-cb?year=${year}`
    );
    return response.data;
  }
}

// Banking Repository Implementation
export class BankingRepository implements IBankingRepository {
  async getBankingRecords(
    shipId: string,
    year: string
  ): Promise<{ totalBanked: number; entries: BankingRecord[] }> {
    const response = await api.get<{ totalBanked: number; entries: BankingRecord[] }>(
      `/banking/records?shipId=${shipId}&year=${year}`
    );
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<void> {
    await api.post("/banking/bank", { shipId, year });
  }

  async applyBanked(shipId: string, year: number): Promise<void> {
    await api.post("/banking/apply", { shipId, year });
  }
}

// Pool Repository Implementation
export class PoolRepository implements IPoolRepository {
  async createPool(
    year: number,
    members: AdjustedCBMember[]
  ): Promise<Pool> {
    const response = await api.post<Pool>("/pools", { year, members });
    return response.data;
  }
}

