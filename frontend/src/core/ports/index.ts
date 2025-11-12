// Port interfaces - define boundaries between core and adapters
import type {
  Route,
  ComparisonResult,
  ComplianceBalance,
  BankingRecord,
  Pool,
  AdjustedCBMember,
} from "../domain/types";

// Outbound port - for external API communication
export interface IRouteRepository {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}

export interface IComplianceRepository {
  getComplianceBalance(routeId: string): Promise<ComplianceBalance>;
  getAdjustedCB(year: string): Promise<AdjustedCBMember[]>;
}

export interface IBankingRepository {
  getBankingRecords(shipId: string, year: string): Promise<{ totalBanked: number; entries: BankingRecord[] }>;
  bankSurplus(shipId: string, year: number): Promise<void>;
  applyBanked(shipId: string, year: number): Promise<void>;
}

export interface IPoolRepository {
  createPool(year: number, members: AdjustedCBMember[]): Promise<Pool>;
}
