# menus

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/dropdown-menu.tsx`: replaced Radix DropdownMenu with Base UI Menu, including Positioner/Popup, submenu, checkbox, radio, and render compatibility. Leftover scan is clean.

## Left alone

No context-menu or menubar wrapper exists in this directory.

## Behavior changes

Submenu open styling uses `data-popup-open`.

## Verify by hand

Check keyboard navigation, typeahead, checkbox/radio selection, submenu placement, Escape, and outside click.
