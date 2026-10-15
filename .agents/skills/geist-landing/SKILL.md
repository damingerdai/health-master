---
name: geist-landing
description: Design and implement restrained, high-quality SaaS marketing landing pages inspired by Vercel's Geist aesthetic. Use for homepages, product launches, feature pages, pricing pages, and conversion-focused marketing websites.
---

# Geist-inspired Landing Page

## Goal
Build distinctive, conversion-oriented marketing pages with editorial typography, disciplined grids, precise spacing, and product-first storytelling. This is an **inspired-by** guide, not an assertion that the values below are official Geist tokens. Never copy Vercel branding, logos, or proprietary illustrations.

## Workflow
1. Inspect the repository's framework, styling, components, design tokens, and routing before editing.
2. Identify the audience, primary conversion action, product differentiator, and required sections. If unspecified, make reasonable assumptions and state them.
3. Sketch section hierarchy and responsive behavior before writing components.
4. Prefer existing components and tokens; only add dependencies when clearly justified.
5. Implement accessible, responsive, production-ready UI with real content or clearly marked placeholders.
6. Review at 375px, 768px, 1280px, and 1440px; verify contrast, keyboard access, motion preferences, and no horizontal overflow.
7. Finish with a short summary of changes and verification performed. Never claim to have tested what was not tested.

## Design tokens
Use semantic CSS custom properties; integrate with the project's existing token system rather than duplicating it. Values are **suggested defaults**, not official Geist specifications.

```css
:root {
  color-scheme: light;
  --font-sans: 'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
  --bg: #ffffff;
  --surface: #fafafa;
  --surface-raised: #ffffff;
  --fg: #171717;
  --fg-muted: #666666;
  --border: #eaeaea;
  --border-strong: #d4d4d4;
  --accent: #171717;
  --accent-fg: #ffffff;
  --focus: #0070f3;
  --success: #16794b;
  --warning: #9a6700;
  --danger: #c62828;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --content-max: 1200px;
  --copy-max: 680px;
  --header-height: 64px;
  --ease-standard: cubic-bezier(.2,.8,.2,1);
  --duration-fast: 120ms;
  --duration-normal: 200ms;
}
[data-theme='dark'], .dark {
  color-scheme: dark;
  --bg: #0a0a0a;
  --surface: #111111;
  --surface-raised: #171717;
  --fg: #ededed;
  --fg-muted: #a1a1a1;
  --border: #292929;
  --border-strong: #404040;
  --accent: #ededed;
  --accent-fg: #111111;
  --focus: #3291ff;
  --success: #45b981;
  --warning: #e4b04b;
  --danger: #ff6b6b;
}
```

- Use a consistent 4px spacing scale. Do not scatter arbitrary pixel values.
- Typography: hero `clamp(2.75rem, 6vw, 5.5rem)`, line-height 1.03–1.12, letter-spacing -0.035em to -0.055em; section heading `clamp(1.75rem, 3vw, 3rem)`; body 16–18px, line-height 1.5–1.7; captions 12–14px.
- Keep hero text width 10–14ch for large headings, body width 55–75ch. Avoid long centered paragraphs.
- Color must carry meaning. Reserve saturated accents for focus, links, or genuinely important product status.
- Use local font assets or existing font loading strategy; avoid introducing layout shift. Respect licensing.

## Page architecture
1. **Announcement (optional):** one concise line, dismissible only if necessary.
2. **Navigation:** 56–72px height; logo left, 3–5 useful links, one prominent CTA; mobile menu keyboard-operable with focus handling.
3. **Hero:** one clear value proposition, supporting sentence, primary CTA, optional secondary CTA, and genuine product screenshot/demo. Do not invent customer metrics or testimonials.
4. **Trust strip (optional):** real logos or concrete evidence only; omit when unavailable.
5. **Feature story:** 2–4 sections alternating copy and actual UI imagery; lead with user outcomes rather than buzzwords.
6. **How it works / developer experience:** use steps, code snippet, or integration diagram when relevant; code must be correct or marked illustrative.
7. **Pricing or conversion section:** clear plan differences and disclaimers; no fabricated prices.
8. **FAQ:** only questions that reduce actual purchase friction.
9. **Final CTA and footer:** repeat primary action; clear legal/support/navigation links.

Do not force all sections into every page. Remove sections that have no purpose.

## Layout and responsive rules
- Desktop: 12-column conceptual grid, `max-width: var(--content-max)`, horizontal padding 32px; tablet 24px; mobile 16–20px.
- Hero: 96–144px vertical breathing room on desktop; 64–88px mobile. Avoid forcing 100vh when it hides the CTA.
- Section rhythm: 96–144px desktop; 56–80px mobile.
- Hero may be centered; subsequent sections can use asymmetry and left alignment for stronger editorial rhythm.
- Product screenshot: show realistic interface detail; use subtle 1px frame, not thick floating device mockups by default.
- Use CSS grid/flex with intrinsic sizing; no fixed widths that overflow at 320–375px.
- Images must have meaningful alt text, explicit dimensions/aspect ratios, and responsive sizing. Decorative images use empty alt.

## Components
- `SiteHeader`: sticky only if it improves navigation; subtle border, no opaque blur stack.
- `Button`: primary solid neutral, secondary outlined/quiet; 36–44px height, visible focus ring, loading/disabled states.
- `Hero`: one h1 per page, concise eyebrow optional, two CTA maximum.
- `ProductPreview`: genuine screenshot/demo, accessible captions, no fake browser chrome unless meaningful.
- `FeatureSection`: reusable content/image alignment, heading and descriptive copy.
- `CodeExample`: mono font, copy action only when functional, horizontal scroll on mobile.
- `PricingCard`: consistent feature lists, truthful pricing and billing labels.
- `FAQ`: native details/summary or accessible accordion; no inaccessible custom toggles.
- `Footer`: restrained columns and small-print links.

## Motion and interaction
- Default to opacity, color, border, and subtle transform transitions of 120–200ms.
- Never animate layout unnecessarily or hide essential content behind scroll-triggered effects.
- Respect `prefers-reduced-motion: reduce`.
- All interactive elements have keyboard focus, proper labels, and at least comfortably tappable targets.

## Anti-patterns — reject
- Purple/blue gradient blobs, glassmorphism, neon glow, excessive shadows, frosted cards.
- Repetitive three-card feature grids with generic icons and no product substance.
- Overly rounded pill-everything interfaces; giant empty hero with no clear product explanation.
- Fake customer logos, invented testimonials, fabricated statistics, meaningless badges.
- Gratuitous animations, parallax, marquee overload, scroll hijacking.
- Generic AI copy: “revolutionize your workflow”, “unleash the power”, “seamless solutions”.
- Low-contrast gray-on-gray body text, invisible focus states, inaccessible mobile navigation.
- Unnecessary UI libraries or replacing established project components without reason.

## Acceptance checklist
- [ ] Primary CTA and value proposition understandable above the fold.
- [ ] Design tokens reused consistently across components.
- [ ] Typography, spacing, borders and states feel coherent.
- [ ] 320/375/768/1280/1440px layouts do not overflow.
- [ ] Keyboard navigation, focus, contrast, alt text and reduced motion checked.
- [ ] No fabricated proof, metrics, integrations, or pricing.
- [ ] Lighthouse/performance concerns addressed (image sizing, fonts, JS weight).
