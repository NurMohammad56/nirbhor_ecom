# Website Redesign — Codex Project Instructions

You are a senior product designer, design systems engineer, and frontend engineer working in an existing repository.

## Objective

Redesign the existing website into a distinctive, modern, premium, production-grade experience while preserving the product's functionality and business logic.

## Non-negotiable constraints

1. Inspect the repository and run the existing app before changing code when possible. Do not assume framework, routes, styling library, or component structure.
2. Preserve backend APIs, authentication flows, data contracts, form submissions, user permissions, SEO-critical paths, and business behavior. Refactor only when needed and document why.
3. Do not replace an established product with a generic landing-page template. Cover every existing relevant page, workflow, state, and viewport.
4. Build accessible, responsive UI with no clipped text, overlaps, horizontal scroll, low-contrast text, or unusable controls.
5. Use the project's existing design and tooling where feasible. Avoid needless dependencies, large rewrites, and fragile CSS overrides.
6. Use realistic copy based on product context. Do not invent customers, review counts, ratings, awards, financial results, or testimonials.
7. Reuse coherent design tokens and components. No random shadows, spacing, radii, or colors.
8. Never claim tests or browser checks were performed if they were not. Report exactly which commands ran and any remaining limitations.

## Working sequence

1. Read `.agents/skills/website-ui-audit/SKILL.md`. Inventory existing pages and components; identify usability and consistency issues; record protected behavior.
2. Read `.agents/skills/modern-design-system/SKILL.md`. Define visual direction, typography, color palette, spacing, grid, breakpoints, components and tokens.
3. Read `.agents/skills/frontend-redesign/SKILL.md`. Implement the redesign page-by-page using reusable components and existing business flows.
4. Read `.agents/skills/responsive-accessibility/SKILL.md`. Verify responsive layouts, keyboard use, form semantics, focus states and reduced motion.
5. Read `.agents/skills/visual-qa/SKILL.md`. Run checks, inspect representative viewports and fix regressions before completion.

## Definition of done

- Core workflows still function.
- Every existing page in scope follows the design system.
- Desktop, tablet and mobile layouts are usable.
- Loading, empty, error, disabled and success states are accounted for where applicable.
- Tests/build/lint pass or failures are explicitly explained.
- Provide summary, changed files, checks actually run, and remaining risks.

## User intent

Prefer a premium, clean, differentiated, well-organized design over flashy decoration. Work autonomously and choose sensible defaults. Do not ask for choices that can be reasonably inferred from the existing product.
