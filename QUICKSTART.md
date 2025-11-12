# 🚀 Quick Start Guide - FuelEU Maritime Platform

This guide will get you up and running in **under 10 minutes**.

## Prerequisites Check

```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
psql --version   # PostgreSQL 14 or higher
```

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Arun-kushwaha007/FuelEU-Maritime.git
cd FuelEU-Maritime
```

## Step 2: Backend Setup (3 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials
```

**Create Database:**
```bash
# Windows PowerShell
psql -U postgres
CREATE DATABASE fueleu_maritime;
\q
```

**Run Migrations and Seed:**
```bash
# Generate Prisma client and run migrations
npx prisma migrate dev --name init

# Seed the database with sample routes
npx prisma db seed

# Start the backend server
npm run dev
```

✅ Backend running at `http://localhost:3000`

## Step 3: Frontend Setup (2 minutes)

**Open a new terminal:**

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# Default settings should work (API at localhost:3000)

# Start the frontend server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

## Step 4: Verify Everything Works (2 minutes)

1. **Open Browser**: Go to `http://localhost:5173`

2. **Test Routes Tab**:
   - Should see 5 routes (R001-R005)
   - Try sorting by clicking column headers
   - Try filters (Vessel Type, Fuel Type, Year)
   - Click "Set Baseline" on R002

3. **Test Compare Tab**:
   - Should see comparison table
   - Check compliance badges (✅/❌)
   - View the bar chart

4. **Test Banking Tab**:
   - Select Ship: R002, Year: 2024
   - Click "Fetch CB + Bank Data"
   - Should show positive CB (surplus)
   - Click "Bank Surplus"
   - Verify banking record appears

5. **Test Pooling Tab**:
   - Select Year: 2024
   - Click "Refresh"
   - Select multiple ships (checkbox)
   - Watch pool sum indicator
   - Click "Create Pool" when valid

## Step 5: Run Tests (1 minute)

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

All tests should pass ✅

## Common Issues & Solutions

### Database Connection Error
**Problem**: `Can't reach database server`
**Solution**:
```bash
# Check PostgreSQL is running
# Windows: Services → PostgreSQL
# Verify DATABASE_URL in backend/.env
```

### Port Already in Use
**Problem**: `Port 3000 is already in use`
**Solution**:
```bash
# Change PORT in backend/.env to 3001
# Update VITE_API_BASE_URL in frontend/.env to http://localhost:3001
```

### Prisma Client Not Generated
**Problem**: `Cannot find module '@prisma/client'`
**Solution**:
```bash
cd backend
npx prisma generate
```

### Frontend Can't Connect to Backend
**Problem**: API calls fail
**Solution**:
- Verify backend is running at `http://localhost:3000`
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` in frontend/.env

## Project Structure Overview

```
FuelEU-Maritime/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── core/         # Business logic (hexagonal core)
│   │   ├── adapters/     # HTTP routes
│   │   └── infrastructure/  # Database, server
│   └── prisma/           # Schema & migrations
│
└── frontend/             # React + TypeScript + Vite
    ├── src/
    │   ├── core/         # Domain types
    │   ├── adapters/
    │   │   ├── ui/       # React components
    │   │   └── infrastructure/  # API client
    │   └── components/   # shadcn/ui components
    └── tests/
```

## Key Features

| Tab | Purpose | Key Actions |
|-----|---------|-------------|
| **Routes** | View all vessel routes | Filter, sort, set baseline |
| **Compare** | Compare to regulatory target | View compliance status, charts |
| **Banking** | Manage surplus/deficit | Bank surplus, apply to deficit |
| **Pooling** | Pool compliance across ships | Create pools, redistribute CB |

## Core Formulas

**Compliance Balance:**
```
CB = (89.3368 - Actual_GHG_Intensity) × Fuel_Consumption × 41,000
```

**Compliance:**
```
Compliant if GHG_Intensity ≤ 89.3368 gCO₂e/MJ
```

## Next Steps

1. Read [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) to see how AI was used
2. Read [REFLECTION.md](./REFLECTION.md) for development insights
3. Review [README.md](./README.md) for complete documentation
4. Check [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md) for requirements

## Development Commands

```bash
# Backend
npm run dev           # Start dev server with watch mode
npm test             # Run all tests
npm run build        # Build for production
npm start            # Start production server

# Frontend
npm run dev          # Start dev server
npm test             # Run all tests
npm run build        # Build for production
npm run preview      # Preview production build
```

## Architecture Highlights

- ✅ **Hexagonal Architecture** - Clean separation of concerns
- ✅ **TypeScript Strict Mode** - Full type safety
- ✅ **Comprehensive Tests** - Unit + Integration
- ✅ **FuelEU Compliance** - Accurate implementation of EU regulation
- ✅ **AI-Assisted** - Documented AI workflow

## Support

For issues or questions:
- Check [README.md](./README.md) for detailed documentation
- Review [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)
- Open an issue on GitHub

---

**Estimated Setup Time**: 10 minutes
**Total Project Complexity**: Full-stack TypeScript with hexagonal architecture
**FuelEU Regulation**: (EU) 2023/1805 - Articles 20 & 21

Happy coding! 🚀
