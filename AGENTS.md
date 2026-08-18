# AI Agent Execution Rules — Disha 4.0 HCOS Repository

## Core Execution Rules

### Honest Execution Tracking
- **Never output "I have updated..." or "Changes are implemented..."** unless a tool call has physically confirmed the code was written to disk.
- Always verify file state via `read_file` or equivalent tool before claiming a change exists.
- If a previous session claimed changes were made, re-verify on disk before proceeding.

### No Incomplete / Placeholder Code
- Do not leave `// TODO` stubs, pseudo-code, or shortened boilerplate in production files unless explicitly requested by the user.
- Every generated function, component, or module must be fully implemented and runnable on first execution.

### Verifiable Diffs
- Whenever changes are declared complete, list the **exact file paths** modified so they can be audited immediately.
- Example format:
  ```
  Affected Files:
  - src/components/ui/BackgroundUnderlay.tsx
  - src/components/ui/ClockworkCounter.tsx
  - src/app/personas/page.tsx
  - src/app/solutions/page.tsx
  ```

### Audit Before Claiming Completion
- Before marking any task as done, run a disk-state check (read the file or grep for the key implementation).
- If the file is missing or the implementation is absent, apply the changes immediately rather than summarizing them as done.

### Minimal Impact Principle
- Modify only what is explicitly requested. Do not refactor, rename, or restructure unrelated code.
- Preserve all existing functionality when making targeted edits.

### Syntax & Type Safety
- All TypeScript files must pass type-checking with zero errors before being declared complete.
- Validate imports, prop types, and interface definitions before writing to disk.

### No Security Headers in next.config.mjs
- Never add HTTP security headers (`X-Frame-Options`, `CSP`, `COEP`, `COOP`, etc.) — this app runs inside an iframe and headers are managed by the platform.

### No Layout.tsx Navigation Components
- Never inline Header, Navbar, Sidebar, or Footer JSX in `src/app/layout.tsx`.
- The global header MUST be mounted once via `FusonicPageLayout` (imported by the root layout). Pages must not render `GlobalFusonicHeader` or a competing `sticky/fixed top-0 z-40/z-50` chrome bar.

### Sticky Header Overflow Lock (Permanent — Mandate #101)
- Never add `overflow-x-hidden`, `overflow-hidden`, `overflow-auto`, or `overflow-scroll` to the outer wrapper in `src/components/layout/FusonicPageLayout.tsx`, `html`, or `body`.
- `overflow-x: hidden` with default `overflow-y: visible` computes `overflow-y` to `auto` (CSS Overflow spec), creating a scroll container that disables `position: sticky`.
- Horizontal clip must use `overflow-x: clip` (not a scrollport) and only on `html`/`body` or `#disha-main-canvas` — never on an ancestor of `#disha-global-header`.
- Never apply `transform-gpu` or `will-change: transform` to `#disha-global-header` (traps the mobile drawer). Apply `transform-gpu` on `#disha-main-canvas` only.
- Always reserve space with `pt-[var(--header-height)]` on `#disha-main-canvas`. Page toolbars use `sticky top-[var(--header-height)] z-20`.

---

## Repository-Specific Context

- **Framework:** Next.js 15, React 19, TypeScript, Tailwind CSS v3
- **Key UI Components:** `BackgroundUnderlay`, `ClockworkCounter`, `AppImage`, `AppIcon`, `AppLogo`
- **Design System:** Dark watch-green base (`var(--watch-green-dark)`), brass-gold accents (`var(--brass-gold)`), Manrope + DM Sans typography
- **Routes:** `/` (Home), `/personas` (Stakeholder Ecosystem), `/solutions` (HCOS Feature Matrix), `/dashboard`, `/nei-assessment`, `/career-recommendations`, `/skill-credentials-wallet`
- **CSS:** Only modify `src/styles/tailwind.css` and `tailwind.config.js`. Never modify `src/styles/index.css`.

---

## Global UI Design Rule: Color-Coded CTA Card Matrix

### Rule (Permanent — applies to ALL future pages and screens)

**Never render plain, monochrome lists of links for navigation options.**

Every selectable option or CTA must be enclosed in its own distinctively colored card component (`OutcomeCtaCard`) with:

1. **Unique Accent Color Palette:** Use distinct, high-contrast theme tokens for each card.
   - Available themes: `emerald`, `indigo`, `violet`, `teal`, `amber`, `rose`, `cyan`, `blue`
   - Never use the same theme twice within the same card group.
2. **Visual Icon:** A relevant SVG icon as a visual anchor.
3. **Actionable Title:** A clear, verb-driven heading (e.g., "Take Your First NEI Assessment →").
4. **Outcome-Driven Description:** 1–2 sentences explaining the **exact expected output or benefit** before the user clicks.
5. **Hover Effects:** `hover:scale-[1.02]` with high-contrast border highlight matching the theme color.
6. **WCAG 2.1 AAA Compliance:** All text/background combinations must satisfy AAA contrast standards.

### Component Reference
- **Reusable Component:** `src/components/ui/OutcomeCtaCard.tsx`
- **Props:** `title`, `description`, `colorTheme`, `icon`, `href`, `isPrimary`, `onClick`
- **Usage Example:** See `src/app/onboarding/page.tsx` for a complete 7-persona implementation.

### When to Apply
- Any page with 2+ navigation choices or feature options
- Onboarding flows, role-selection screens, feature discovery pages
- Any "What do you want to do next?" type UI pattern

---

## Extensibility Rule: demoFeaturesConfig.ts

### Rule (Permanent — applies to ALL future platform value propositions)

**All newly added platform value propositions MUST automatically register an interactive feature step inside `src/config/demoFeaturesConfig.ts` for live client testing.**

- Adding a new `DemoFeature` entry to any persona array in `demoFeaturesConfig.ts` automatically creates a new sidebar action and workspace view in `/demo` — no other wiring required.
- The `DemoFeature` interface defines: `id`, `stepNumber`, `title`, `description`, `icon`, `accentColor`, `controls`, `metrics`, `chartType`, and optional `downloadLabel`/`downloadFormat`.
- Export utilities for new report types belong in `src/lib/exportUtils.ts`.
- The `/demo` page (`src/app/demo/page.tsx`) is fully driven by `PERSONA_DEMO_CONFIGS` — never hardcode persona steps directly in the page component.

### Component Reference
- **Config File:** `src/config/demoFeaturesConfig.ts`
- **Demo Page:** `src/app/demo/page.tsx`
- **Export Utils:** `src/lib/exportUtils.ts`
