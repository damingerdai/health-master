# select

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/select.tsx`: Base UI List, Positioner, Popup, ItemIndicator, and scroll arrows. Leftover scan is clean.

## Left alone

None.

## Behavior changes

Consumer callback shape is adapted from Base UI's event-details API.

## Verify by hand

Test typeahead, arrows, selection, disabled items, placement, and controlled value.
