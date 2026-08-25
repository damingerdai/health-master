# project

2026-08-25, legacy `new-york` style transformation-engine migration, all Radix imports in `components/ui` were replaced with Base UI and TypeScript passes.

## Changed

Added `@base-ui/react`; migrated avatar, button, checkbox, dialog, dropdown-menu, form, label, popover, radio-group, select, separator, sheet, tabs, toggle, toggle-group, tooltip, breadcrumb, badge, and Slot consumers in sidebar. Removed unused direct Radix primitive dependencies. `grep -n "radix-ui\|@radix-ui" components/ui` is clean.

## Left alone

`drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp.tsx` (input-otp), `calendar.tsx` (react-day-picker), and `chart.tsx` (recharts) were intentionally untouched.

## Behavior changes

Base UI uses `render` internally and presence attributes such as `data-open`, `data-checked`, `data-active`, and `data-pressed`. Popover, tooltip, menu, and select now use `Positioner > Popup`. Base UI ToggleGroup and Select callbacks are adapted at the wrapper boundary to preserve existing consumer APIs. Tabs retain Base UI's manual-activation behavior; verify keyboard behavior manually.

## Verify by hand

Open dialogs and sheets and verify focus return, Escape, outside click, and side animations. Check menu/select keyboard navigation and typeahead. Check tooltip delay and placement. Check checkbox indeterminate state and the chart's single-select toggle group.

## Verification

`npx tsc --noEmit` passed. `npm run lint` passed with 13 pre-existing warnings. `npm run build` remains blocked by the environment failing to fetch Google Geist fonts from Google Fonts.
