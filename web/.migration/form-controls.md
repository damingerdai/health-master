# form-controls

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `toggle.tsx`, `toggle-group.tsx`: replaced Radix controls with Base UI controls and adapted existing consumer value APIs. Leftover scan is clean.

## Left alone

No slider or switch wrapper exists in this directory.

## Behavior changes

Select and ToggleGroup callbacks are adapted from Base UI's richer/multi-value signatures.

## Verify by hand

Test keyboard selection, disabled and indeterminate states, controlled values, and form submission.
