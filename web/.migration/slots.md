# slots

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/button.tsx`, `badge.tsx`, `breadcrumb.tsx`, `form.tsx`, and `sidebar.tsx`: removed Radix Slot imports and preserved existing polymorphic consumer behavior through Base UI render or local element composition. Leftover scan is clean.

## Left alone

No related files.

## Behavior changes

None known beyond Base UI render semantics.

## Verify by hand

Exercise links rendered as buttons, sidebar custom elements, badge links, and form controls.
