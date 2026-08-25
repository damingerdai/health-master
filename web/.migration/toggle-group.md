# toggle-group

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/toggle-group.tsx`: Base UI ToggleGroup and Toggle items, with single-value compatibility. Leftover scan is clean.

## Left alone

None.

## Behavior changes

Base UI internally represents group values as arrays.

## Verify by hand

Test single selection, keyboard navigation, and active styling.
