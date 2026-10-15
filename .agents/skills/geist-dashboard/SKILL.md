---
name: geist-dashboard
description: Design and implement precise, information-dense SaaS and developer-tool dashboards inspired by Vercel's Geist aesthetic. Use for admin consoles, settings, analytics, deployments, resources, tables, forms, and application shells.
---

# Geist-inspired Dashboard

## Goal
Build a calm, fast, keyboard-friendly application interface where hierarchy, state, and actions are immediately clear. Follow the existing product architecture and reuse the landing page's shared semantic design tokens. This guide is **inspired by** Vercel's aesthetic, not an official Geist token specification.

## Workflow
1. Inspect app routing, data models, API calls, auth boundaries, existing components, and design tokens.
2. Identify user jobs, navigation hierarchy, entities, permissions, and primary workflows.
3. Map loading, empty, success, partial, error, and permission-denied states before implementation.
4. Reuse the shared tokens; do not create a second incompatible palette or duplicate primitives.
5. Build the shell and one representative page end-to-end before expanding patterns.
6. Verify desktop, tablet and mobile behavior, keyboard flow, table overflow, error handling, and accessibility.
7. Report implementation and tests honestly; flag any stubbed data or unimplemented actions.

## Shared design tokens
Use the same `--font-sans`, `--font-mono`, `--bg`, `--surface`, `--surface-raised`, `--fg`, `--fg-muted`, `--border`, `--border-strong`, `--accent`, `--accent-fg`, `--focus`, `--success`, `--warning`, `--danger`, radii and spacing tokens as `geist-landing`. Import a single shared token stylesheet/package; do not duplicate literal definitions across apps.

Dashboard-specific suggested additions:

```css
:root {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 56px;
  --topbar-height: 56px;
  --content-max-dashboard: 1440px;
  --table-row-height: 44px;
  --control-height: 36px;
  --control-height-compact: 32px;
  --page-padding: 32px;
  --panel-gap: 24px;
}
@media (max-width: 767px) {
  :root { --page-padding: 16px; --panel-gap: 16px; }
}
```

- Page title 24–30px, section title 16–20px, body 13–14px for dense UI and 14–16px for descriptions.
- Default border 1px, shadows rarely used. Prefer clear alignment and separators over cards around every block.
- Monospace for IDs, timestamps, commands, hashes, log lines and code, not long body paragraphs.
- Use tabular numerals for metrics and aligned numeric columns.
- Status uses text plus icon/shape, never color alone. Ensure adequate text contrast in both themes.

## Information architecture and shell
- **Sidebar:** product/workspace switcher, 4–8 top-level destinations, clear active state, grouped subnavigation. 240px desktop; collapsed or overlay on narrower screens.
- **Topbar:** breadcrumb/context, optional search or command menu, notifications only when real, account menu. Keep primary actions near the page title when relevant.
- **Page header:** title, one-sentence context (if needed), status and one primary action. Avoid redundant welcome banners.
- **Content:** prefer one primary column with contextual side panel only when needed. Use max-width 1440px for complex pages; narrower 720–960px for settings/forms.
- **Tables:** default for comparable records; search, filter, sort, pagination and selection only when implemented and useful.
- **Detail pages:** summary/status first, tabs or sections next, destructive controls clearly separated.
- **Settings:** grouped sections, concise descriptions, explicit save behavior, visible success/error feedback.

## Page layout rules
- Desktop ≥1280px: persistent sidebar, content padding 24–32px, 12-column conceptual grid.
- Tablet 768–1279px: collapsible sidebar or drawer, content padding 20–24px.
- Mobile <768px: navigation drawer, stacked header/actions, cards or horizontally scrollable tables as appropriate; never shrink columns to illegibility.
- Dashboard density is deliberate: 8–16px inside controls, 16–24px between related blocks, 32–48px between major sections.
- For wide tables, prioritize key columns, allow horizontal scroll, and preserve accessible column headers.
- Sticky header/first column only when it demonstrably improves navigation; account for stacking and focus visibility.

## Components and behavior
- `AppShell`: landmark regions (`nav`, `header`, `main`), skip-to-content link, mobile navigation focus trap/restore.
- `SidebarNav`: semantic links, visible active item, icons optional and consistently sized.
- `PageHeader`: breadcrumb, h1, secondary text, relevant actions.
- `Button`: primary, secondary, quiet and danger variants; 32–40px height; loading and disabled states.
- `Input`, `Select`, `Textarea`: real labels, help/error text, keyboard focus, clear validation and submission state.
- `DataTable`: proper table semantics, stable column headers, empty state, skeleton loading, error/retry, sort direction announcement, pagination controls.
- `StatusBadge`: neutral/success/warning/error variants with explicit text; avoid badges for ordinary metadata.
- `Metric`: label, value, period and delta with unit and contextual explanation; no fake precision.
- `Tabs`: only for peer views; keyboard-operable, URL-addressable when appropriate.
- `Dialog`: focus management, Escape handling, accessible name, destructive confirmation when necessary.
- `Toast`: supplemental confirmation; critical errors also persist near the affected content.
- `EmptyState`: describe what is missing and give one useful next step, not a giant illustration.
- `Code/LogViewer`: mono font, copy action, wrap/scroll controls, sensible limits or virtualization for large datasets.

## Data, states, and integrity
- Never invent backend data, operational status, success messages or working functionality.
- Prefer typed API boundaries, stable keys, and explicit loading/error/empty states.
- Do not render misleading success before mutation confirmation; handle retries and race conditions.
- For destructive actions: clear scope, confirmation proportional to risk, and actionable failure feedback.
- Use locale-aware dates/numbers and timezone labels when timestamps matter.
- For large lists, use server pagination or virtualization as warranted; avoid rendering thousands of DOM nodes.
- Preserve URL state for meaningful filters/search/pagination where the app's router supports it.

## Accessibility and interaction
- Keyboard order follows visual order; focus is always visible.
- Dialogs, menus, comboboxes, and tables use established accessible primitives when available.
- Minimum accessible contrast: target WCAG AA (4.5:1 normal text, 3:1 large text and meaningful non-text UI).
- Never convey success/warning/error by color alone.
- Respect reduced motion; keep hover/press feedback subtle (120–200ms).
- Loading skeletons must not produce large layout shifts. Announce important async results appropriately.

## Anti-patterns — reject
- Dashboard composed entirely of oversized cards, huge gaps and decorative icons.
- Gradient backgrounds, glassmorphism, neon accents, glowing charts, exaggerated rounded corners.
- Using color badges for every property or using green to decorate a summary box.
- Hidden controls that appear only on hover with no keyboard access.
- Placeholder charts with random data presented as real analytics.
- Fake functional buttons, dead search, decorative pagination, misleading “saved” toasts.
- Excessive modals, nested tabs, duplicated sidebars, unnecessary breadcrumbs.
- Tiny low-contrast text, icon-only buttons without accessible labels, ambiguous status colors.
- Arbitrary one-off CSS values that break the shared design system.

## Acceptance checklist
- [ ] Navigation hierarchy matches actual routes and permissions.
- [ ] Main user task is discoverable with minimal clicks.
- [ ] Loading, empty, error, permission and success states are covered.
- [ ] Table/filter/form actions are real or explicitly marked as prototypes.
- [ ] Keyboard/focus/contrast/mobile/table overflow checked.
- [ ] Shared tokens and primitives match the marketing site.
- [ ] No fake data or invented status represented as production truth.
- [ ] Performance and network-error behavior considered.
