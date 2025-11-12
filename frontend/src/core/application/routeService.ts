// Use case: Manage routes
import type { Route, ComparisonResult } from "../domain/types";
import type { IRouteRepository } from "../ports";

export class RouteService {
  constructor(private repository: IRouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.repository.getAllRoutes();
  }

  async setBaseline(routeId: string): Promise<void> {
    return this.repository.setBaseline(routeId);
  }

  async getComparison(): Promise<ComparisonResult> {
    return this.repository.getComparison();
  }

  // Filter routes by criteria
  filterRoutes(
    routes: Route[],
    filters: { vesselType?: string; fuelType?: string; year?: string }
  ): Route[] {
    return routes.filter((route) => {
      if (
        filters.vesselType &&
        filters.vesselType !== "all" &&
        route.vesselType !== filters.vesselType
      )
        return false;
      if (
        filters.fuelType &&
        filters.fuelType !== "all" &&
        route.fuelType !== filters.fuelType
      )
        return false;
      if (
        filters.year &&
        filters.year !== "all" &&
        String(route.year) !== filters.year
      )
        return false;
      return true;
    });
  }

  // Extract unique values for filters
  getUniqueVesselTypes(routes: Route[]): string[] {
    return Array.from(new Set(routes.map((r) => r.vesselType))).sort();
  }

  getUniqueFuelTypes(routes: Route[]): string[] {
    return Array.from(new Set(routes.map((r) => r.fuelType))).sort();
  }

  getUniqueYears(routes: Route[]): string[] {
    return Array.from(new Set(routes.map((r) => String(r.year)))).sort();
  }
}
