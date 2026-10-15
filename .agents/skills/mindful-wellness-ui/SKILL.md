---
name: mindful-wellness-ui
description: Design and implement serene, warm, healing, and minimalist-elegant interfaces (身心放松 · 温暖治愈 · 极简优雅) for Health Master. Use for authentication pages, home/landing pages, health dashboards, forms, and personal wellness workflows.
---

# Mindful Wellness UI (身心放松 · 温暖治愈 · 极简优雅)

## Goal
Create calm, restorative, and minimalist-elegant interfaces where tracking personal health feels like a gentle daily conversation with oneself—never a cold clinical terminal or a stressful race of numbers. Combine organic warmth, generous breathing room, and tactile simplicity with rigorous accessibility and engineering quality.

## Core Design Principles

### 1. 身心放松 (Mind-Body Relaxation & Breathing Room)
- **Generous Whitespace:** Give every heading, card, and input control ample breathing room (`gap-6`/`gap-7`, `p-6`/`p-7` on cards). Avoid cramped, high-density developer-console layouts on personal or emotional flows.
- **Organic Rhythm:** Use soft, concentric breathing rings, diffused warm light (`blur-3xl` at low opacity), and unhurried transitions (`duration-300`) that invite the user to slow down.
- **Calm Copywriting:** Frame actions and states gently (e.g., *"Step into your calm space"*, *"Begin your wellness journey"*, *"Peace of mind"*, *"Quietly protected"*). Avoid alarmist language or rigid technical jargon (`TELEMETRY SCHEMA`, `ERR_CODE`, etc.).

### 2. 温暖治愈 (Warm & Healing Palette)
- **Warm Linen & Stone Canvas:** Prefer warm ivory, linen, and stone neutrals (`#FAF8F5`, `stone-50` to `stone-800`) over stark `#000000` / `#FFFFFF` clinical contrast.
- **Botanical Sage Primary Accent:** Use deep calming sage / forest green (`#3F6254`, hover `#345246`; dark mode `emerald-700` / `emerald-300`) as the primary interactive and reassuring brand color.
- **Sunlight & Rose Semantic Tones:**
  - Warm amber / morning sun (`amber-100/80`, `amber-700`) for temperature, energy, and gentle highlights.
  - Soft rose (`rose-50/70`, `rose-200/80`, `rose-700`) for heart rate and non-alarming inline error notices.
  - Soft sage (`emerald-900/5`, `#3F6254`) for positive status badges and security reassurance.
- **Dark Mode Harmony:** Use warm dark stone (`dark:bg-stone-950`, `dark:bg-stone-900/70`, `dark:border-stone-800/80`) with muted emerald accents (`dark:bg-emerald-950/30`, `dark:text-emerald-300`).

### 3. 极简优雅 (Minimalist & Elegant Craft)
- **Soft Tactile Surfaces:**
  - Primary containers use `rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm`.
  - Form inputs and OTP slots use `rounded-xl border-stone-200/90 bg-[#FAF8F5]/70` at rest, transitioning smoothly to `focus-visible:bg-white focus-visible:border-[#3F6254]/50 focus-visible:ring-[#3F6254]/15` on focus.
- **Editorial & Humanist Typography:**
  - Use balanced font weights (`font-medium` / `font-normal` over heavy `font-extrabold`), comfortable line heights (`leading-relaxed`), and occasional italic serif accents (`font-serif italic`) for poetic emphasis.
- **Restrained Visual Hierarchy:**
  - Pair each page title with a single soft capsule eyebrow badge (`rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254]`).
  - Keep secondary actions understated (pill-shaped ghost links `rounded-full px-4 py-2 text-xs text-stone-500 hover:bg-stone-200/50`).

## Reference Tokens & Utility Patterns

```css
:root {
  --wellness-bg: #FAF8F5;
  --wellness-surface: rgba(255, 255, 255, 0.85);
  --wellness-fg: #292524;       /* stone-800 */
  --wellness-fg-muted: #78716c; /* stone-500 */
  --wellness-border: rgba(231, 229, 228, 0.7); /* stone-200/70 */
  --wellness-sage: #3F6254;
  --wellness-sage-hover: #345246;
  --wellness-sage-soft: rgba(6, 78, 59, 0.05);
}
```

### Standard Component Recipes (Tailwind CSS)
- **Page Header Eyebrow Badge:**
  `inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300`
- **Card Container:**
  `rounded-3xl border border-stone-200/70 bg-white/85 p-6 sm:p-7 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70`
- **Text / Password / Email Input:**
  `h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 text-sm text-stone-800 placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100`
- **Primary Button:**
  `h-11 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:hover:bg-emerald-600`
- **Inline Error Alert (`role="alert"`):**
  `flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300`

## Accessibility, States & Functional Integrity
- **Never break existing functionality:** Preserve all validation schemas (`zod`), form state (`react-hook-form`), server actions, API calls, and session redirects.
- **Zero-CLS Skeletons:** Always provide `loading.tsx` or `<Suspense>` fallbacks that match the rounded-3xl card and input geometry of the loaded view.
- **Persistent Inline Feedback:** Supplement transient toasts (`sonner`) with calm, inline `role="alert"` banners that clear automatically when the user resumes typing.
- **Keyboard & Screen Reader Support:** Maintain explicit `<Label>` associations, `autoComplete` attributes, `aria-label` on icon toggles (such as password visibility), and visible focus rings.

## Anti-Patterns — Reject
- Cold developer-console aesthetics (harsh black borders, dense monospace telemetry tables, uppercase technical error codes) on personal health flows.
- Random external stock photography (`picsum.photos`, generic hospital imagery).
- Neon gradients, aggressive red error flashes, or cluttered multi-badge cards.
- Tiny cramped inputs or unaligned password visibility buttons.
