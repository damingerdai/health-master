# button

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/button.tsx`: replaced Radix Slot with the Base UI Button primitive and `render`. Leftover scan is clean.

## Left alone

No related files.

## Behavior changes

Polymorphic consumers now flow through Base UI `render`.

## Verify by hand

Check every variant, keyboard focus, disabled state, and `asChild` usage.
