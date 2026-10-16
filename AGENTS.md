# Repository Instructions & AI Coding Rules

This repository is a **TypeScript-first application**. Use this document as the absolute source of truth for technical constraints, build environments, and definition-of-done criteria. Override any generic or conflicting assumptions.

## 🛠️ Verification & Operational Commands

Always execute commands using the project’s strict toolchains. Do not guess parameters.

| Action | Command | Scope / Notes |
| :--- | :--- | :--- |
| **Install Dependencies** | `pnpm install` | Non-interactive. Do not modify lockfile manually. |
| **Type Check** | `pnpm typecheck` | Run before declaring a task complete. Strict mode enabled. |
| **Linting** | `pnpm lint` | Enforces ESLint and stylistic boundaries. |
| **Run Tests** | `pnpm test` | Runs unit/integration suite via Vitest. |
| **Build Project** | `pnpm build` | Generates build artifacts / distribution bundles. |

## 📐 TypeScript Architecture & Patterns

*   **Strict Mode Enforced:** Always assume `"strict": true` is enabled in `tsconfig.json`. Do not use any variations of `any` bypasses (`any`, `explicit-any` rules suppression) or `ts-ignore` statements unless explicitly requested.
*   **Type Safety:** Prefer explicit return types for public functions, custom hooks, and API handlers to maintain clean API boundaries.
*   **Patterns over Chains:** Favor functional programming patterns. Use modern `async/await` syntax exclusively over raw standard `.then()` Promise chains.
*   **Type vs. Interface:** 
    *   Use `interface` for defining object shapes, contract declarations, and public extension APIs.
    *   Use `type` for unions, intersections, tuple types, and simple primitive mappings.

## ✒️ Stylistic Code Conventions

*   **Semicolons & Quotes:** Use single quotes (`'`) for string primitives. Do not use trailing semicolons (`;`) except where syntactically required (e.g., separating grouped execution lines or destructuring expressions).
*   **Data Models:** Keep domain models flat and immutable. Avoid deeply nested mutations. Use structural spreading (`...object`) to copy and update records safely.
*   **Imports & Modules:** 
    *   Always prefer modern ESM `import` statements over CommonJS `require`.
    *   Use explicit type-only imports where possible: `import type { User } from './types'` to support clean optimization trees.

## 🧪 Testing & Definition of Done

*   **Test Environment:** The testing matrix relies heavily on **Vitest**. Write explicit unit assertions instead of legacy global expectations.
*   **Isolation Rules:** Write tests within local `__tests__` or matching directory pathways adjacent to the files being edited. Never touch global configurations or bootstrap assets unless specifically commanded.
*   **Before Reporting Completion:**
    1. Verify code passes `pnpm typecheck` cleanly without warning suppression.
    2. Confirm new test additions successfully execute and achieve full coverage.
    3. Run `pnpm lint` to check format rules.
