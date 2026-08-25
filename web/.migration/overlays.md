# overlays

2026-08-25, transformation engine, migrated dialog, sheet, popover, and tooltip.

## Changed

`components/ui/dialog.tsx`, `sheet.tsx`, `popover.tsx`, `tooltip.tsx`: replaced Radix overlay parts with Base UI Backdrop/Popup/Positioner anatomy and presence-state classes. Leftover scan is clean.

## Left alone

Drawer remains vaul and was intentionally not migrated.

## Behavior changes

Animation hooks use Base UI starting/ending styles; Popover and Tooltip Anchor/Content positioning is represented by Positioner. Verify focus and dismissal reasons.

## Verify by hand

Open each overlay, test Escape/outside click/focus return, side placement, and tooltip delay.
