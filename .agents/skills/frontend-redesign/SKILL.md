---
name: frontend-redesign
description: Implement a complete, coherent redesign in an existing frontend codebase without breaking routes, APIs, authentication, data, or interactions.
---
# Frontend Redesign

1. Follow repository conventions and reuse its framework, routing, data fetching and styling approach.
2. Refactor shared layout primitives first: header, sidebar, navigation, content container, page headers, cards and controls.
3. Redesign all in-scope pages in an order that maximizes component reuse.
4. Preserve user-visible semantics, API calls, auth gates, forms, validation, product logic and existing states.
5. Consider every major interaction: menus, search, filter/sort, tabs, modals, dialogs, forms, pagination, upload, checkout, etc. Never leave purely visual fake controls.
6. Avoid adding large new packages unless necessary; keep performance and bundle size in view.
7. Prefer semantic HTML, composable components, clear state management and maintainable styles over one-off hacks.
8. Use existing icons/images or carefully sourced project assets. Don't hotlink unstable image sources or use arbitrary external dependencies.
9. Make hover, focus, active, disabled, loading, error and empty states visually intentional.
10. If changes require architecture or behavior tradeoffs, document them in the final summary.
