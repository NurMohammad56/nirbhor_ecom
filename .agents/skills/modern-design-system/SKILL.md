---
name: modern-design-system
description: Define and implement a premium, coherent design system for an existing web product, including tokens, typography, layout, reusable components and visual identity.
---
# Modern Design System

Create a context-specific visual identity, not a generic AI dashboard.

## Foundations
- Choose a restrained brand palette: neutral surfaces, one primary accent and a purposeful semantic palette.
- Define tokens for backgrounds, foregrounds, borders, muted text, accent, success/warning/error, shadows and focus rings.
- Set a consistent type scale, font weights, line heights, sensible max-widths and accessible contrast.
- Use a 4/8px-based spacing scale where practical and a small, consistent radius/shadow system.
- Provide a responsive grid and container system; don't hardcode widths causing overflow.
- Support existing dark mode if applicable. Add dark mode only if it fits project scope.

## UI components
Build or consolidate buttons, inputs, select, textarea, checkbox/radio, badges, cards, modals, drawers, toasts, navigation, breadcrumbs, pagination, skeletons, tables, empty states and error states as required by actual screens.

## Visual quality
- Strong hierarchy, generous but efficient whitespace, consistent icon style, accurate alignment.
- Distinctive composition where useful, but preserve clarity and task efficiency.
- Real product content and sensible truncation; never fabricate social proof.
- Avoid excessive glassmorphism, gradients, animation, huge rounded corners or ornamental clutter.

Implement tokens in the existing CSS/Tailwind/theme system rather than maintaining a disconnected specification.
