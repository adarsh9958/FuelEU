// Domain entities - no framework dependencies
export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption_t: number;
  distance_km: number;
  totalEmissions_t: number;
  isBaseline?: boolean;
};

export type ComparisonRow = {
  routeId: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export type ComparisonResult = {
  baseline: Route;
  rows: ComparisonRow[];
};

export type ComplianceBalance = {
  routeId: string;
  actualIntensity_g: number;
  targetIntensity_g: number;
  totalDistance_km: number;
  complianceBalance_gco2eq: number;
};

export type BankingRecord = {
  id: number;
  shipId: string;
  year: number;
  cb_before_g: number;
  banked_g: number;
  borrowed_g: number;
  cb_after_g: number;
  createdAt: Date;
};

export type BankingData = {
  cb: ComplianceBalance;
  records: BankingRecord[];
};

export type PoolMember = {
  shipId: string;
  cb_before_g: number;
  cb_after_g?: number;
};

export type Pool = {
  id: number;
  year: number;
  members: PoolMember[];
  pooledCB_g: number;
  perShipAllocation_g: number;
  createdAt: Date;
};

export type AdjustedCBMember = {
  shipId: string;
  cb_before_g: number;
};
