# Backend - FuelEU Maritime Compliance API

## Architecture

This backend follows **Hexagonal Architecture** (Ports & Adapters pattern) to ensure:
- Core business logic is independent of frameworks
- Easy testing with mock implementations
- Flexibility to swap infrastructure components

## Project Structure

```
backend/
├── src/
│   ├── core/
│   │   ├── application/         # Use cases (business logic)
│   │   │   ├── computeCB.ts     # Compliance Balance calculation
│   │   │   ├── computeComparison.ts
│   │   │   ├── banking.ts       # Banking logic (Article 20)
│   │   │   └── pooling.ts       # Pooling logic (Article 21)
│   │   ├── domain/              # Domain entities and types
│   │   │   └── types.ts
│   │   └── ports/               # Port interfaces (boundaries)
│   │       └── index.ts         # Repository and use-case interfaces
│   ├── adapters/
│   │   ├── inbound/
│   │   │   └── http/            # HTTP adapter (Express routes)
│   │   │       └── routes.ts
│   │   └── outbound/            # (Future: Prisma repository implementations)
│   └── infrastructure/
│       ├── db/                  # Database client
│       │   └── client.ts
│       └── server/              # Server setup
│           └── index.ts
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Seed data
│   └── migrations/              # Database migrations
└── tests/                       # Tests
    ├── core/                    # Unit tests for use cases
    └── integration/             # Integration tests for HTTP endpoints
```

## Core Concepts

### Ports (Interfaces)
Located in `src/core/ports/`, these define the contracts:
- **Repository Ports**: Database operations (e.g., `RouteRepository`)
- **Use Case Ports**: Business logic interfaces (e.g., `ComputeCBUseCase`)

### Application Layer
Located in `src/core/application/`, contains:
- **computeCB.ts**: Implements compliance balance formula
- **computeComparison.ts**: Compares routes to baseline
- **banking.ts**: Banking surplus/deficit logic
- **pooling.ts**: Greedy pooling allocation algorithm

### Adapters
- **Inbound**: HTTP routes that accept requests and call use cases
- **Outbound**: Database repositories implementing port interfaces

### Infrastructure
Framework-specific code (Express, Prisma) that doesn't leak into core.

## Dependencies

```json
{
  "express": "HTTP server framework",
  "prisma": "ORM and database migrations",
  "@prisma/client": "Generated Prisma client",
  "typescript": "Type safety",
  "jest": "Testing framework",
  "supertest": "HTTP endpoint testing"
}
```

## Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_maritime"
TARGET_INTENSITY=89.3368
PORT=3000
```

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- banking.test.ts
```

## API Endpoints

See main [README.md](../README.md#-api-documentation) for full API documentation.

### Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/routes` | GET | Fetch all routes |
| `/routes/:routeId/baseline` | POST | Set baseline route |
| `/routes/comparison` | GET | Compare routes to baseline |
| `/compliance/cb` | GET | Calculate compliance balance |
| `/compliance/adjusted-cb` | GET | Get adjusted CB (after banking) |
| `/banking/records` | GET | Get banking history |
| `/banking/bank` | POST | Bank positive surplus |
| `/banking/apply` | POST | Apply banked to deficit |
| `/pools` | POST | Create compliance pool |

## FuelEU Maritime Formulas

### Compliance Balance
```
CB (gCO₂e) = (Target - Actual_GHG_Intensity) × Energy_in_Scope

where:
  Energy_in_Scope = Fuel_Consumption_t × 41,000 MJ/t
  Target = 89.3368 gCO₂e/MJ (2025, 2% below 91.16)
```

### Banking Rules (Article 20)
- Only positive CB can be banked
- Banked surplus can be applied to future deficits
- Bank entries are cumulative

### Pooling Rules (Article 21)
- Sum of pool members' CB must be ≥ 0
- Deficit ships cannot exit worse
- Surplus ships cannot exit negative
- Greedy allocation: surplus transfers to deficits

## Development Notes

### Hexagonal Architecture Benefits
1. **Testability**: Use cases can be tested without HTTP or database
2. **Flexibility**: Easy to swap Express for Fastify, or Prisma for another ORM
3. **Clarity**: Clear separation between business logic and infrastructure

### Adding New Features
1. Define port interface in `src/core/ports/`
2. Implement use case in `src/core/application/`
3. Create HTTP adapter in `src/adapters/inbound/http/`
4. Write tests in `tests/core/` and `tests/integration/`

## License

MIT
