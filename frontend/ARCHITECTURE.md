# Frontend Architecture - Hexagonal Pattern

## 📐 Architecture Overview

This frontend application follows the **Hexagonal Architecture** (Ports & Adapters) pattern to ensure clean separation of concerns and testability.

```
src/
├── core/                    # Business logic (no framework dependencies)
│   ├── domain/             # Domain entities and types
│   │   └── types.ts        # Route, ComplianceBalance, Pool, etc.
│   ├── application/        # Use cases / Business logic
│   │   ├── routeService.ts
│   │   ├── bankingService.ts
│   │   └── poolingService.ts
│   └── ports/              # Interface definitions
│       └── index.ts        # Repository interfaces
├── adapters/
│   ├── ui/                 # Inbound adapters (React components)
│   │   ├── App.tsx
│   │   └── tabs/
│   │       ├── RoutesTab.tsx
│   │       ├── CompareTab.tsx
│   │       ├── BankingTab.tsx
│   │       └── PoolingTab.tsx
│   └── infrastructure/     # Outbound adapters (API clients)
│       ├── api.ts          # Repository implementations
│       └── services.ts     # Service container
├── components/             # Reusable UI components
└── lib/                    # Utilities
```

## 🎯 Layer Responsibilities

### Core Layer (Business Logic)

**No external dependencies** - Pure TypeScript/JavaScript

#### `core/domain/`
- Defines domain entities and types
- `Route`, `ComplianceBalance`, `Pool`, `BankingRecord`, etc.
- Pure data structures with no business logic

#### `core/application/`
- Contains use cases and business rules
- **`RouteService`**: Manage routes, filtering, comparison
- **`BankingService`**: Compliance balance and banking operations
- **`PoolingService`**: Pool creation and validation
- No React dependencies
- No direct API calls

#### `core/ports/`
- Defines interfaces (contracts) for adapters
- **Inbound ports**: What the core exposes to the UI
- **Outbound ports**: What the core needs from external services
  - `IRouteRepository`
  - `IComplianceRepository`
  - `IBankingRepository`
  - `IPoolRepository`

### Adapter Layer

#### `adapters/ui/` (Inbound)
- React components that present data to users
- Call services from `core/application/`
- Handle user interactions and UI state
- Use Tailwind CSS for styling

#### `adapters/infrastructure/` (Outbound)
- Implement repository interfaces from `core/ports/`
- **API implementations**: 
  - `RouteRepository`
  - `ComplianceRepository`
  - `BankingRepository`
  - `PoolRepository`
- Handle HTTP communication with backend

## 🔄 Data Flow

1. **User Interaction** → UI Component (`adapters/ui/`)
2. **Component** → Service (`core/application/`)
3. **Service** → Repository Interface (`core/ports/`)
4. **Repository Implementation** → API (`adapters/infrastructure/`)
5. **Backend** → Response
6. **Service** → Business Logic
7. **Component** → Render Result

## ✅ Benefits

- **Testability**: Core logic can be tested without React or API
- **Independence**: Business rules don't depend on frameworks
- **Flexibility**: Easy to swap API implementation or UI framework
- **Maintainability**: Clear boundaries between layers
- **Reusability**: Core logic can be used in different contexts

## 🧪 Testing Strategy

- **Unit Tests**: Test services in `core/application/` with mock repositories
- **Integration Tests**: Test repositories in `adapters/infrastructure/` with real API
- **Component Tests**: Test UI components with mock services

## 📦 Dependency Direction

```
UI Components → Application Services → Port Interfaces ← Infrastructure Adapters
     ↓                    ↓                                        ↓
  (React)          (Pure TS/JS)                              (Axios/API)
```

**Rule**: Dependencies point inward. Core never depends on adapters.

## 🚀 Usage Example

```typescript
// ❌ BAD: Component calling API directly
const fetchRoutes = async () => {
  const res = await api.get("/routes");
  setRoutes(res.data);
};

// ✅ GOOD: Component using service
const fetchRoutes = async () => {
  const data = await routeService.getAllRoutes();
  setRoutes(data);
};
```

## 🎨 Styling

- **TailwindCSS** for utility-first styling
- **shadcn/ui** for pre-built component primitives
- All styles in UI layer only

## 🔧 Adding New Features

1. **Define types** in `core/domain/types.ts`
2. **Create port interface** in `core/ports/index.ts`
3. **Implement service** in `core/application/`
4. **Implement repository** in `adapters/infrastructure/api.ts`
5. **Register service** in `adapters/infrastructure/services.ts`
6. **Create UI component** in `adapters/ui/`

---

**Key Principle**: Keep the core clean and framework-agnostic!
