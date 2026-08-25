# popover

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/popover.tsx`: Base UI Positioner and Popup migration; Anchor export was removed because Base UI has no equivalent. Leftover scan is clean.

## Left alone

None.

## Behavior changes

Positioning is owned by Positioner.

## Verify by hand

Test placement, Escape, outside click, focus return, and controlled open state.
