# AI Agent Workflow Log

## Agents Used

This project was developed using the following AI agents:
- **GitHub Copilot** - For inline code completions and boilerplate generation
- **GitHub Copilot Chat** - For architectural guidance, code refactoring, and debugging assistance
- **Claude Code (via VS Code)** - For complex multi-file refactoring and documentation generation

---

## Prompts & Outputs

### Example 1: Database Schema Generation

**Prompt:**
```
Create a Prisma schema for FuelEU Maritime compliance system with tables for:
- Routes (routeId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions, isBaseline)
- ShipCompliance (shipId, year, cb_gco2eq)
- BankEntry (shipId, year, amount)
- Pool and PoolMember (for pooling functionality)
```

**Generated Output:**
```prisma
model Route {
  id                Int      @id @default(autoincrement())
  routeId           String   @unique
  vesselType        String
  fuelType          String
  year              Int
  ghgIntensity      Float
  fuelConsumption_t Float
  distance_km       Int
  totalEmissions_t  Float
  isBaseline        Boolean  @default(false)
  createdAt         DateTime @default(now())
}

model ShipCompliance {
  id        Int      @id @default(autoincrement())
  shipId    String
  year      Int
  cb_gco2eq Float
  createdAt DateTime @default(now())
}

model BankEntry {
  id        Int      @id @default(autoincrement())
  shipId    String
  year      Int
  amount    Float
  createdAt DateTime  @default(now())
}

model Pool {
  id        Int      @id @default(autoincrement())
  year      Int
  createdAt DateTime  @default(now())
  members   PoolMember[]
}

model PoolMember {
  id         Int    @id @default(autoincrement())
  poolId     Int
  shipId     String
  cb_before  Float
  cb_after   Float
  pool       Pool    @relation(fields: [poolId], references: [id])
}
```

**Validation:** Schema was tested with `npx prisma migrate dev` and successfully created all tables with proper relationships.

---

### Example 2: Compliance Balance Calculation

**Prompt:**
```
Implement the FuelEU Maritime compliance balance formula:
CB = (Target - Actual) × Energy_in_scope
where Energy_in_scope = fuelConsumption_t × 41000 MJ/t
Target = 89.3368 gCO2e/MJ for 2025
```

**Generated Output:**
```typescript
export function computeCBForRoute(
  route: { fuelConsumption_t: number; ghgIntensity: number },
  targetIntensity: number = 89.3368
) {
  const energyInScope_MJ = route.fuelConsumption_t * 41000;
  const complianceBalance_gco2eq = 
    (targetIntensity - route.ghgIntensity) * energyInScope_MJ;
  
  return {
    energyInScope_MJ,
    complianceBalance_gco2eq,
    status: complianceBalance_gco2eq >= 0 ? 'surplus' : 'deficit'
  };
}
```

**Validation:** Unit tests verified calculations match manual Excel calculations for all 5 sample routes.

---

### Example 3: React Component with TanStack Table

**Prompt:**
```
Create a RoutesTab component using TanStack Table with:
- Sortable columns
- Filters for vesselType, fuelType, year
- Set Baseline button for each row
- TypeScript strict mode
```

**Generated Output:**
```typescript
export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState({
    vesselType: "all",
    fuelType: "all",
    year: "all",
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "routeId",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Route ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    // ... more columns
  ];
  
  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });
  
  // ... component JSX
}
```

**Refinement:** Initially generated code didn't include proper TypeScript types. I added explicit `Route` interface imports and `ColumnDef<Route>[]` typing.

---

### Example 4: Pooling Greedy Algorithm

**Prompt:**
```
Implement FuelEU Article 21 pooling logic:
- Sort members by CB descending
- Transfer surplus from positive CB ships to deficit ships
- Ensure no surplus ship ends negative
- Ensure no deficit ship exits worse
- Return cb_after for each member
```

**Generated Output:**
```typescript
export function createPoolGreedy(
  members: { shipId: string; cb_before_g: number }[]
) {
  const sum = members.reduce((acc, m) => acc + m.cb_before_g, 0);
  if (sum < 0) throw new Error("Pool sum must be >= 0");

  const sorted = [...members].sort((a, b) => b.cb_before_g - a.cb_before_g);
  const result = sorted.map(m => ({ ...m, cb_after_g: m.cb_before_g }));

  for (let i = 0; i < result.length; i++) {
    if (result[i].cb_after_g > 0) {
      for (let j = result.length - 1; j > i; j--) {
        if (result[j].cb_after_g < 0) {
          const transfer = Math.min(result[i].cb_after_g, -result[j].cb_after_g);
          result[i].cb_after_g -= transfer;
          result[j].cb_after_g += transfer;
        }
      }
    }
  }

  return result;
}
```

**Validation:** Created unit tests with edge cases (all deficit, all surplus, mixed). Algorithm correctly redistributed compliance balance.

---

### Example 5: API Client with Axios

**Prompt:**
```
Create a type-safe API client for the frontend using axios with:
- Base URL from environment variable
- TypeScript generics for responses
- Error handling
```

**Generated Output:**
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

export const api = {
  get: <T>(url: string) => apiClient.get<T>(url),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: any) => apiClient.put<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};
```

**Correction:** Agent initially used `process.env` instead of `import.meta.env` for Vite. I corrected this manually.

---

## Validation / Corrections

### 1. **Schema Field Names**
- **Issue:** Agent used camelCase for Prisma fields which conflicted with PostgreSQL conventions
- **Fix:** Standardized to snake_case with `@map` directives where needed
- **Validation:** Ran migrations and seed script successfully

### 2. **TypeScript Strict Mode**
- **Issue:** Some generated components had `any` types
- **Fix:** Added explicit type definitions for all props and state
- **Validation:** `npm run type-check` passes with no errors

### 3. **Banking Logic Edge Cases**
- **Issue:** Agent didn't handle case where bank is applied but leaves residual deficit
- **Fix:** Modified `/banking/apply` endpoint to calculate `cb_after` correctly
- **Validation:** Integration tests verify all banking scenarios

### 4. **Missing Adjusted CB Endpoint**
- **Issue:** Frontend referenced `/compliance/adjusted-cb` but backend didn't implement it
- **Fix:** Added endpoint to calculate CB after applying banked amounts
- **Validation:** Pooling tab now fetches correct adjusted values

### 5. **React Component Duplicate Rendering**
- **Issue:** App.tsx rendered both `Placeholder` and actual tab components
- **Fix:** Removed duplicate conditional rendering blocks
- **Validation:** Each tab now renders only once without flickering

---

## Observations

### Where AI Agents Saved Time

1. **Boilerplate Reduction (80% time saved)**
   - Express route handlers
   - Prisma model definitions
   - React component scaffolding with TypeScript types
   - TanStack Table setup and configuration

2. **Complex Algorithm Implementation (60% time saved)**
   - Pooling greedy allocation algorithm
   - Compliance balance calculations with multiple variables
   - Comparison logic with percentage calculations

3. **Test Generation (70% time saved)**
   - Unit test scaffolding for all use-cases
   - Mock data generation for integration tests
   - Edge case identification and test coverage

4. **Documentation (50% time saved)**
   - API endpoint documentation
   - Component prop documentation
   - README structure and content

### Where AI Agents Failed or Hallucinated

1. **Environment Variables**
   - Confused Node.js `process.env` with Vite's `import.meta.env`
   - Required manual correction in 3 files

2. **Hexagonal Architecture**
   - Generated direct database calls in route handlers initially
   - Needed explicit prompting to separate concerns into ports/adapters
   - Required manual refactoring to properly implement dependency inversion

3. **Complex Business Logic**
   - Initial pooling algorithm didn't enforce "deficit can't exit worse" rule
   - Banking logic didn't properly track accumulated bank entries
   - Required detailed specification and multiple iterations

4. **CSS and Styling**
   - Generated inconsistent Tailwind class usage
   - Some accessibility attributes were missing
   - Needed manual review for responsive design

### How Tools Were Combined Effectively

1. **Copilot Inline + Chat**
   - Used inline for quick completions (imports, simple functions)
   - Used chat for architectural questions and complex logic

2. **Copilot Chat + Claude Code**
   - Copilot for initial implementation
   - Claude for large-scale refactoring across multiple files

3. **Agent-Assisted Debugging**
   - Used Copilot to identify test failures
   - Claude to suggest fixes based on error messages
   - Manual verification of all fixes

---

## Best Practices Followed

### 1. **Incremental Prompting**
- Started with high-level architecture
- Drilled down to specific components
- Iteratively refined based on output quality

### 2. **Explicit Type Specifications**
- Always requested TypeScript strict mode
- Specified exact interfaces in prompts
- Validated with `tsc --noEmit`

### 3. **Test-Driven Prompts**
```
"Generate a function that computes X, and include unit tests 
that verify edge cases: null input, negative values, boundary conditions"
```

### 4. **Architecture-First Approach**
- Requested ports/adapters separation explicitly
- Asked for dependency injection patterns
- Verified no framework coupling in core domain

### 5. **Code Review Process**
- Never accepted AI output blindly
- Ran tests after each generation
- Manually verified business logic against FuelEU regulation

### 6. **Documentation Alongside Code**
```
"Generate this function with JSDoc comments explaining 
the FuelEU formula being implemented"
```

### 7. **Contextual Refinement**
- Provided error messages to AI for debugging
- Shared test failures to get targeted fixes
- Referenced specific FuelEU articles in prompts

---

## Metrics

| Task Category | Time Without AI | Time With AI | Savings |
|---------------|----------------|--------------|---------|
| Project Setup | 2 hours | 30 min | 75% |
| Backend API | 8 hours | 3 hours | 62% |
| Frontend Components | 10 hours | 4 hours | 60% |
| Testing | 6 hours | 2 hours | 67% |
| Documentation | 3 hours | 1 hour | 67% |
| **Total** | **29 hours** | **10.5 hours** | **64%** |

---

## Conclusion

AI agents significantly accelerated development while maintaining code quality through:
- Rapid boilerplate generation
- Architectural guidance
- Test scaffolding
- Documentation assistance

However, critical validation was essential for:
- Business logic correctness
- Architectural compliance
- TypeScript type safety
- Edge case handling

The key to success was treating AI as a **highly productive junior developer** that requires code review and architectural guidance, not as an autonomous solution generator.
