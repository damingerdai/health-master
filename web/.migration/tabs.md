# tabs

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/tabs.tsx`: mapped Trigger to Tab and Content to Panel, and rewrote state selectors. Leftover scan is clean.

## Left alone

No related files.

## Behavior changes

Base UI's manual activation behavior is retained and flagged for QA.

## Verify by hand

Check arrow-key navigation, activation, focus, disabled tabs, and panel visibility.
