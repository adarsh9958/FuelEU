// Service container - dependency injection for services
import { RouteService } from "../../core/application/routeService";
import { BankingService } from "../../core/application/bankingService";
import { PoolingService } from "../../core/application/poolingService";
import {
  RouteRepository,
  ComplianceRepository,
  BankingRepository,
  PoolRepository,
} from "./api";

// Create repository instances
const routeRepository = new RouteRepository();
const complianceRepository = new ComplianceRepository();
const bankingRepository = new BankingRepository();
const poolRepository = new PoolRepository();

// Create service instances with injected dependencies
export const routeService = new RouteService(routeRepository);
export const bankingService = new BankingService(
  complianceRepository,
  bankingRepository
);
export const poolingService = new PoolingService(
  complianceRepository,
  poolRepository
);
