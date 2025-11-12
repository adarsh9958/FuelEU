# Frontend - FuelEU Maritime Compliance Dashboard

## Architecture

This frontend follows **Hexagonal Architecture** (Ports & Adapters pattern):
- Core domain logic is independent of React
- UI components are adapters implementing presentation
- API client is an adapter implementing data fetching

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool with HMR
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **TanStack Table** - Data tables
- **Recharts** - Charts
- **Axios** - HTTP client
- **Vitest** - Testing framework

## Project Structure

```
frontend/
├── src/
│   ├── core/domain/              # Domain types
│   ├── adapters/
│   │   ├── ui/tabs/              # React components
│   │   └── infrastructure/       # API client
│   ├── components/               # shadcn/ui components
│   └── lib/                      # Utilities
└── tests/                        # Tests
```

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Features

### Routes Tab
- Data table with sorting and filters
- Set baseline functionality

### Compare Tab
- Comparison table and charts
- Compliance status indicators

### Banking Tab
- CB display and banking operations
- Transaction history

### Pooling Tab
- Pool creation with validation
- Member selection and allocation

See main [README.md](../README.md) for complete documentation.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
