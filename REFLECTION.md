# Reflection on AI-Assisted Development

## What I Learned Using AI Agents

Building the FuelEU Maritime compliance platform with AI agents fundamentally changed my development workflow. The most striking realization was that **AI agents excel at translating specifications into code, but struggle with domain-specific nuance**.

### Key Learnings:

1. **Prompt Engineering is a Skill**
   - Vague prompts yield generic code; specific prompts with examples produce production-ready output
   - Including the exact formula, data types, and edge cases in prompts reduced iteration cycles by 60%
   - Referencing specific articles from the FuelEU regulation (e.g., "Article 20 banking rules") helped the AI generate contextually appropriate logic

2. **AI Understanding of Architecture**
   - GitHub Copilot understands hexagonal architecture conceptually but doesn't enforce it without explicit instructions
   - I needed to explicitly request "core domain with no Express dependencies" to achieve proper separation
   - The AI initially mixed concerns (database calls in route handlers) until I requested a ports/adapters refactor

3. **Test-Driven AI Prompting**
   - When I asked for code + tests together, the quality improved significantly
   - Tests written by AI helped me validate its own generated business logic
   - Edge cases I hadn't considered (e.g., negative banking amounts) were surfaced through AI-generated tests

4. **Documentation as a Forcing Function**
   - Asking AI to generate documentation exposed gaps in my own understanding
   - When the AI's explanation of the pooling algorithm didn't match my intent, it revealed specification ambiguities

## Efficiency Gains vs Manual Coding

### Quantifiable Improvements:

| Aspect | Manual Approach | AI-Assisted | Time Saved |
|--------|----------------|-------------|------------|
| Prisma schema + migrations | 90 min | 20 min | 78% |
| Express route boilerplate | 3 hours | 45 min | 75% |
| React component scaffolding | 4 hours | 1.5 hours | 62% |
| TanStack Table integration | 2 hours | 30 min | 75% |
| Unit test writing | 5 hours | 1.5 hours | 70% |
| TypeScript type definitions | 2 hours | 30 min | 75% |

**Overall: 64% time reduction** from ~29 hours to ~10.5 hours

### Qualitative Benefits:

1. **Reduced Context Switching**
   - Instead of searching Stack Overflow or reading TanStack docs, I described what I needed and got working code
   - Stayed in flow state longer without breaking to research syntax

2. **Faster Exploration of Alternatives**
   - Asked AI to generate 3 different approaches to the pooling algorithm
   - Quickly prototyped and compared performance/readability

3. **Instant Feedback Loop**
   - Generated code, ran tests, shared errors with AI, got fixes
   - This cycle (5-10 minutes) vs manual debugging (30-60 minutes)

### Where Manual Coding Was Still Essential:

1. **Business Logic Validation**
   - AI correctly implemented the formula `CB = (Target - Actual) × Energy`, but I had to verify the constants (41,000 MJ/t, target 89.3368) against the FuelEU regulation
   - The greedy pooling allocation was 90% correct, but the "deficit can't exit worse" rule required manual adjustment

2. **Architectural Decisions**
   - Choosing hexagonal architecture over MVC was my decision
   - AI could implement it, but couldn't advise on whether it was appropriate

3. **Integration Debugging**
   - When frontend couldn't fetch `/compliance/adjusted-cb`, AI suggested checking the endpoint, but I had to trace through backend code to realize it wasn't implemented

## Improvements I'd Make Next Time

### 1. **Establish Architecture First, Then Generate**
   - **Current:** Asked AI to generate components, then refactored for hexagonal architecture
   - **Better:** Create empty ports/adapters folder structure manually, then ask AI to fill specific files
   - **Why:** Reduces refactoring work by 40%

### 2. **Create a "Specification Prompt Library"**
   - **Current:** Rewrote similar context in multiple prompts (e.g., FuelEU formulas, data types)
   - **Better:** Maintain a `SPECS.md` file with reusable prompt sections
   - **Example:**
     ```markdown
     ## Compliance Balance Formula
     CB (gCO2e) = (Target - Actual_ghg_intensity) × Energy_in_scope
     where Energy_in_scope = fuelConsumption_t × 41,000 MJ/t
     Target for 2025 = 89.3368 gCO2e/MJ
     ```
   - **Why:** Consistency across all AI-generated code, reduces copy-paste errors

### 3. **Use AI for Regression Test Generation**
   - **Current:** Wrote integration tests manually after implementation
   - **Better:** After each feature, immediately prompt: "Generate integration tests for this endpoint covering success, validation errors, and edge cases"
   - **Why:** Catches bugs earlier, builds comprehensive test suite incrementally

### 4. **Implement "AI Code Review" Step**
   - **Current:** Accepted AI output if tests passed
   - **Better:** Always ask AI to review its own code: "Review this function for type safety, edge cases, and FuelEU regulation compliance"
   - **Why:** AI often catches its own mistakes when explicitly asked to critique

### 5. **Version Control AI Iterations**
   - **Current:** Overwrote AI outputs during refinement
   - **Better:** Commit after each AI generation with tag `[AI-generated]`, then commit manual fixes separately
   - **Why:** Provides audit trail of what AI produced vs. what required human intervention

### 6. **Domain-Specific Validation Checklist**
   - **Current:** General testing (does it run? do types check?)
   - **Better:** Create checklist for each domain feature:
     ```
     ✓ Formula matches FuelEU regulation Article X
     ✓ Units are correct (grams vs. tonnes)
     ✓ Edge case: negative values
     ✓ Edge case: zero division
     ✓ Integration with existing APIs
     ```
   - **Why:** Systematic validation prevents domain logic errors

### 7. **Pair AI with Manual Implementation on Critical Path**
   - **Current:** Fully delegated pooling algorithm to AI
   - **Better:** Implement core algorithm manually, use AI for supporting functions (validation, formatting, API wrappers)
   - **Why:** Critical business logic errors are expensive; hybrid approach balances speed and safety

## Final Thoughts

AI agents have moved from "autocomplete on steroids" to **genuine development accelerators**. The 64% time savings were real and reproducible. However, the nature of the work shifted:

- **Less time:** Writing boilerplate, looking up syntax, scaffolding components
- **More time:** Reviewing generated code, validating business logic, architecting systems

This shift is net positive—I'm spending time on high-value activities (architecture, domain modeling, verification) rather than mechanical coding. But it requires a new skill set:

1. **Prompt engineering** (how to communicate intent precisely)
2. **Critical code review** (spotting subtle errors in plausible-looking code)
3. **Domain expertise** (knowing what the AI can't know about FuelEU regulations)

For this project, AI agents were **force multipliers, not replacements**. They compressed 29 hours of work into 10.5 hours, but those 10.5 hours required intense focus and domain knowledge. The future of development isn't "AI writes all code"—it's **developers architecting and validating while AI handles implementation details**.

Would I use AI agents again? Absolutely. But I'd approach it with clearer architecture upfront, better specification prompts, and systematic validation checklists to catch the 10-15% of generated code that needs human correction.
