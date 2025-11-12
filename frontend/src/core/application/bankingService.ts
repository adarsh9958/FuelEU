// Use case: Manage compliance balance and banking
import type { ComplianceBalance, BankingRecord } from "../domain/types";
import type { IComplianceRepository, IBankingRepository } from "../ports";

export class BankingService {
  constructor(
    private complianceRepo: IComplianceRepository,
    private bankingRepo: IBankingRepository
  ) {}

  async getComplianceBalance(routeId: string): Promise<ComplianceBalance> {
    return this.complianceRepo.getComplianceBalance(routeId);
  }

  async getBankingRecords(
    shipId: string,
    year: string
  ): Promise<{ totalBanked: number; entries: BankingRecord[] }> {
    return this.bankingRepo.getBankingRecords(shipId, year);
  }

  async bankSurplus(shipId: string, year: number): Promise<void> {
    return this.bankingRepo.bankSurplus(shipId, year);
  }

  async applyBanked(shipId: string, year: number): Promise<void> {
    return this.bankingRepo.applyBanked(shipId, year);
  }

  // Business logic: check if banking is allowed
  canBank(cb: ComplianceBalance): boolean {
    return cb.complianceBalance_gco2eq > 0;
  }

  // Business logic: check if borrowing is allowed
  canBorrow(cb: ComplianceBalance): boolean {
    return cb.complianceBalance_gco2eq < 0;
  }
}
