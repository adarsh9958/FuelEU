// Use case: Manage pooling
import type { Pool, AdjustedCBMember } from "../domain/types";
import type { IComplianceRepository, IPoolRepository } from "../ports";

export class PoolingService {
  constructor(
    private complianceRepo: IComplianceRepository,
    private poolRepo: IPoolRepository
  ) {}

  async getAdjustedCB(year: string): Promise<AdjustedCBMember[]> {
    return this.complianceRepo.getAdjustedCB(year);
  }

  async createPool(
    year: number,
    members: AdjustedCBMember[]
  ): Promise<Pool> {
    // Business rule: pool must have at least 2 members
    if (members.length < 2) {
      throw new Error("Pool must have at least 2 members");
    }

    // Business rule: pooled CB must be non-negative
    const poolSum = members.reduce((sum, m) => sum + m.cb_before_g, 0);
    if (poolSum < 0) {
      throw new Error("Total pooled compliance balance must be non-negative");
    }

    return this.poolRepo.createPool(year, members);
  }

  // Calculate total pooled CB
  calculatePoolSum(members: AdjustedCBMember[]): number {
    return members.reduce((sum, m) => sum + m.cb_before_g, 0);
  }

  // Validate pool eligibility
  isValidPool(members: AdjustedCBMember[]): boolean {
    if (members.length < 2) return false;
    const poolSum = this.calculatePoolSum(members);
    return poolSum >= 0;
  }
}
