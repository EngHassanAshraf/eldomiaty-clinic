# Implementation Plan: premium-ui-enhancement

## Overview

Elevate the El-Domiaty Clinic website to a premium glassmorphism aesthetic using a CSS-first, token-driven approach. All changes are confined to `src/app/globals.css` and the existing component files. No new files, routes, or data models are introduced. Implementation follows the order: design tokens → component-by-component visual upgrades → property-based tests.

## Tasks

- [ ] 1. Audit and complete `globals.css` design tokens and utility classes
  - [x] 1.1 Verify `:root` contains all required CSS custom properties
    - Confirm `--rose`, `--rose-light`, `--rose-soft`, `--rose-pale`, `--blush`, `--ivory`, `--warm-50/100/200/700/900`, `--text-main`, `--text-muted`, `--text-light` are present
    - Add any missing tokens; do not duplicate values already defined
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Verify all background utility classes are defined
    - Confirm `.bg-ivory`, `.bg-rose-pale`, `.bg-rose-soft`, `.bg-hero-premium`, `.bg-section-a`, `.bg-section-b` exist in `@layer utilities`
    - _Requirements: 2.2, 3.1, 3.2_

  - [x] 1.3 Verify all glass utility classes are defined
    - Confirm `.glass`, `.glass-rose`, `.glass-dark`, `.glass-highlight::before` exist with correct `backdrop-filter`, `background`, and `border` values
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [x] 1.4 Verify all gradient, shadow, and glow utilities are defined
    - Confirm `.grad-rose`, `.grad-rose-soft`, `.grad-hero`, `.grad-section`, `.grad-stats`, `.text-grad-rose` exist
    - Confirm `.shadow-rose`, `.shadow-rose-lg`, `.shadow-rose-xl`, `.shadow-soft`, `.shadow-card`, `.shadow-card-lg`, `.glow-rose`, `.glow-rose-sm` exist
    - _Requirements: 3.1, 6.1, 7.1_

  - [x] 1.5 Verify card, button, badge, and divider utilities are defined
    - Confirm `.card-base` (with `::before` highlight and `:hover` spring lift), `.card-hover`, `.btn-rose` (with `::after` sheen and hover/active states), `.btn-outline-rose`, `.badge-rose`, `.divider-rose` exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 17.3, 17.4_

  - [x] 1.6 Verify layout and texture utilities are defined
    - Confirm `.section-padding`, `.section-header`, `.noise-overlay::after`, `.mobile-cta-bar` exist
    - _Requirements: 3.4, 16.2, 17.1, 17.2_

  - [x] 1.7 Verify all `@keyframes` and animation classes are defined
    - Confirm `@keyframes float`, `orb`, `fadeUp`, `pulseRose`, `shimmer`, `countIn` exist
    - Confirm `.animate-float`, `.animate-float-slow`, `.animate-float-delayed`, `.animate-pulse-rose`, `.animate-fade-up`, `.animate-shimmer`, `.animate-count`, `.animate-orb-1`, `.animate-orb-2`, `.animate-orb-3` exist with correct durations and delays
    - _Requirements: 5.2, 18.1_

  - [x] 1.8 Add `prefers-reduced-motion` override block at end of `globals.css`
    - Add `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important` on `*, *::before, *::after`
    - _Requirements: 18.3_

- [ ] 2. Navbar — scroll-aware glass transition and mobile menu
  - [x] 2.1 Implement scroll-aware class switching in `Navbar.tsx`
    - Ensure `useEffect` adds a `scroll` listener setting `scrolled = window.scrollY > 24`
    - When `scrolled === false`: apply `bg-transparent py-4` to `<header>`
    - When `scrolled === true`: apply `glass shadow-soft py-2 border-b border-rose-100/60` to `<header>`
    - Ensure `transition-all duration-300` is on the `<header>` element
    - _Requirements: 14.1, 14.2_

  - [x] 2.2 Verify mobile menu renders as glass dropdown
    - Confirm the mobile menu `div` uses the `.glass` class and `border-t border-rose-100/50`
    - Confirm nav links inside use `hover:text-[#e8294a] hover:bg-[#fff0f3]` transitions
    - Confirm the WhatsApp booking button inside uses `.btn-rose`
    - _Requirements: 14.5, 14.6_

- [ ] 3. Hero — animated orbs, overlays, glass card, floating badges, halo rings
  - [x] 3.1 Verify three animated orbs are present in `Hero.tsx`
    - Confirm orb 1: `animate-orb-1`, top-right, `w-[560px] h-[560px]`, blush radial gradient, `blur(40px)`, `aria-hidden`, `pointer-events-none`
    - Confirm orb 2: `animate-orb-2`, bottom-left, `w-[420px] h-[420px]`, rose-soft radial gradient, `blur(50px)`, `aria-hidden`, `pointer-events-none`
    - Confirm orb 3: `animate-orb-3`, mid-left, `w-[300px] h-[300px]`, rose-light radial gradient, `blur(35px)`, `aria-hidden`, `pointer-events-none`
    - _Requirements: 5.1, 5.2, 18.1_

  - [x] 3.2 Verify dot-grid overlay and top highlight line in `Hero.tsx`
    - Confirm dot-grid `div` has `aria-hidden`, `opacity-[0.022]`, `pointer-events-none`, `radial-gradient` 36px grid
    - Confirm top highlight `div` has `aria-hidden`, 1px height, transparent-to-blush-to-transparent gradient
    - _Requirements: 3.5, 5.3, 5.4, 18.2_

  - [x] 3.3 Verify main glass card in `Hero.tsx`
    - Confirm card `div` uses `.glass`, `border-white/75`, `.glow-rose`, `.shadow-rose-xl`, `rounded-[2rem]`
    - Confirm inner top highlight `div` is `aria-hidden` with white gradient
    - _Requirements: 4.5, 5.5_

  - [x] 3.4 Verify floating badges and halo rings in `Hero.tsx`
    - Confirm badge 1: `-top-4 -left-4`, `.glass-rose`, `.animate-float-delayed`
    - Confirm badge 2: `-bottom-4 -right-4`, `.glass-rose`, `.animate-float-slow`
    - Confirm halo ring 1: `scale-[1.07]`, `border-[#fad4db]/30`, `-z-10`, `aria-hidden`
    - Confirm halo ring 2: `scale-[1.14]`, `border-[#fad4db]/15`, `-z-10`, `aria-hidden`
    - _Requirements: 5.5, 5.6_

  - [x] 3.5 Verify hero badge uses `animate-fade-up` in `Hero.tsx`
    - Confirm the `.badge-rose` element at the top of the text column has the `.animate-fade-up` class
    - _Requirements: 5.7_

- [ ] 4. Stats — glass-dark cards, CountUp hook, hover glow, bottom accent line
  - [x] 4.1 Verify Stats section background layers in `Stats.tsx`
    - Confirm section has `relative overflow-hidden noise-overlay`
    - Confirm `grad-stats` absolute layer exists
    - Confirm softened overlay layer with `rgba(232,41,74,0.92) → rgba(242,92,116,0.88) → rgba(249,168,180,0.80)` exists
    - Confirm dot-pattern layer: `aria-hidden`, `opacity-[0.08]`, white 1px dots, 26px grid
    - Confirm top and bottom 1px edge highlight lines are `aria-hidden`
    - _Requirements: 2.3, 3.3, 3.4, 3.5_

  - [x] 4.2 Verify glass-dark stat cards in `Stats.tsx`
    - Confirm each stat card uses `.glass-dark`, `rounded-3xl`, `border border-white/12`, `group`, `transition-all duration-300`
    - Confirm `hover:border-white/25` and `hover:shadow-[0_8px_32px_rgba(0,0,0,0.20)]` are applied
    - _Requirements: 8.1, 8.2_

  - [x] 4.3 Verify hover glow overlay on stat cards in `Stats.tsx`
    - Confirm each card contains an absolutely-positioned `div` with `aria-hidden`, `opacity-0 group-hover:opacity-100 transition-opacity duration-300`, and a `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)` background
    - _Requirements: 8.3_

  - [x] 4.4 Verify CountUp hook implementation in `Stats.tsx`
    - Confirm `CountUp` function component accepts `{ target, suffix }` props
    - Confirm it uses `useState(0)`, `useRef<HTMLDivElement>`, and `started = useRef(false)`
    - Confirm `useEffect` creates `IntersectionObserver` with `threshold: 0.5`
    - Confirm animation: `duration = 1600`, `steps = 50`, `inc = target / steps`, `setInterval` at `duration / steps` ms
    - Confirm `Math.min(cur + inc, target)` clamp and `clearInterval` when `cur >= target`
    - Confirm `started.current = true` is set before the interval starts
    - Confirm `return () => obs.disconnect()` cleanup
    - _Requirements: 8.4, 8.5_

  - [x] 4.5 Verify bottom accent line on stat cards in `Stats.tsx`
    - Confirm each card has a `div` with `h-0.5 w-10 mx-auto rounded-full bg-white/25 group-hover:w-16 group-hover:bg-white/50 transition-all duration-400`
    - _Requirements: 8.6_

- [ ] 5. About — card-base credential rows with Lucide icons and specialty grid
  - [x] 5.1 Verify credential rows in `About.tsx`
    - Confirm each credential uses `.card-base`, `flex items-center gap-3`, `group`
    - Confirm icon badge uses `.grad-rose`, `rounded-xl`, `group-hover:scale-110 transition-transform duration-250`
    - Confirm icons are GraduationCap, Award, Globe, Heart (in order) from `lucide-react`
    - Confirm text uses `group-hover:text-[#2d1a1a] transition-colors`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 5.2 Verify 2×2 specialty grid in `About.tsx`
    - Confirm grid has 4 cells: حقن مجهرى (rose), ولادة بدون ألم (amber), مناظير نسائية (emerald), جراحات نسائية (violet)
    - Confirm each cell has a distinct `bg-gradient-to-br` background and matching `border` color
    - Confirm `hover:scale-[1.03] hover:shadow-soft transition-all duration-200`
    - _Requirements: 9.5, 9.6_

- [ ] 6. Services — card-base cards, icon glow, active filter tab, booking CTA
  - [x] 6.1 Verify service cards in `Services.tsx`
    - Confirm each service card uses `.card-base`, `text-center`, `group`
    - Confirm icon `div` has `group-hover:scale-115 transition-transform duration-300 group-hover:drop-shadow-[0_4px_8px_rgba(232,41,74,0.30)]`
    - Confirm title text has `group-hover:text-[#2d1a1a] transition-colors`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 6.2 Verify filter tabs in `Services.tsx`
    - Confirm active tab uses `grad-rose text-white shadow-rose scale-[1.04]`
    - Confirm inactive tab hover uses `hover:border-[#e8294a]/50 hover:text-[#e8294a] hover:bg-[#fff0f3]`
    - _Requirements: 10.5, 10.6_

  - [x] 6.3 Verify booking CTA button in `Services.tsx`
    - Confirm the bottom CTA uses `.btn-rose` with `px-8 py-4`
    - _Requirements: 10.7_

- [ ] 7. VideoSection — glow card, custom play overlay, Facebook iframe, bottom bar
  - [x] 7.1 Verify video card structure in `VideoSection.tsx`
    - Confirm card uses `rounded-3xl overflow-hidden shadow-rose-xl border border-[#fad4db]/50`
    - Confirm top highlight `div` is `aria-hidden`, 1px, transparent-to-blush-to-transparent gradient, `z-10`
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 7.2 Verify pre-play overlay in `VideoSection.tsx`
    - Confirm overlay contains 2 `aria-hidden` orb `div`s with blurred radial gradients
    - Confirm floating logo card uses `.animate-float` and `.grad-rose`
    - Confirm doctor name and subtitle text are present
    - Confirm play button uses `.btn-rose` and `.animate-pulse-rose`
    - _Requirements: 11.4, 11.6_

  - [x] 7.3 Verify play-click behavior in `VideoSection.tsx`
    - Confirm `useState(false)` for `playing` state
    - Confirm clicking play button calls `setPlaying(true)`
    - Confirm when `playing === true` the Facebook `<iframe>` renders and the overlay is absent
    - _Requirements: 11.5_

  - [x] 7.4 Verify bottom info bar in `VideoSection.tsx`
    - Confirm bottom bar contains doctor name badge with `.grad-rose` and a "فتح على فيسبوك" link with `ExternalLink` icon
    - _Requirements: 11.7_

- [ ] 8. Testimonials — gradient avatars, center card elevation, nav controls
  - [x] 8.1 Verify avatar initials and gradient cycling in `Testimonials.tsx`
    - Confirm `AVATAR_COLORS` array has exactly 3 distinct gradient strings
    - Confirm each avatar `div` uses `bg-gradient-to-br ${AVATAR_COLORS[i]}` where `i` is the card position (0, 1, 2)
    - Confirm avatar displays `{t.author[0]}` as text content
    - _Requirements: 12.1, 12.2_

  - [x] 8.2 Verify center card elevation in `Testimonials.tsx`
    - Confirm card at `i === 1` has `scale-[1.04]`, `.shadow-rose-lg`, `border-[#fad4db]/80`, `z-10`
    - Confirm card at `i === 1` has a top accent line `div` with `aria-hidden` and `.grad-rose`
    - Confirm non-center cards have `opacity-90 scale-[0.98]`
    - _Requirements: 12.3, 12.4_

  - [x] 8.3 Verify navigation controls in `Testimonials.tsx`
    - Confirm prev/next buttons use `.glass border border-[#fad4db]/70` and `active:scale-95`
    - Confirm active dot uses `w-7 h-2.5 grad-rose` (pill shape)
    - Confirm inactive dots use `w-2.5 h-2.5 bg-[#fad4db]`
    - Confirm clicking dot `i` calls `setIdx(i)`
    - _Requirements: 12.5, 12.6_

  - [x] 8.4 Verify Quote icon in `Testimonials.tsx`
    - Confirm `<Quote>` icon from `lucide-react` is rendered with `rotate-180` and `text-[#fad4db]` on each card
    - _Requirements: 12.7_

- [ ] 9. Branches — per-branch accent colors and glass-rose contact strip
  - [x] 9.1 Verify branch card accent colors in `Branches.tsx`
    - Confirm `ACCENTS` array has 4 entries: rose (`grad-rose`, `border-[#fad4db]/70`), amber (`from-orange-400 to-amber-400`, `border-[#fde8c8]/70`), emerald (`from-emerald-400 to-teal-400`, `border-[#c8f0e0]/70`), violet (`from-violet-400 to-purple-500`, `border-[#d8c8f8]/70`)
    - Confirm each card uses `.card-base`, `border-2 ${a.ring}`, `group`
    - Confirm icon badge uses `${a.icon}`, `group-hover:scale-110 transition-transform duration-250`
    - Confirm top accent line `div` is `aria-hidden` and uses `${a.icon}`
    - _Requirements: 13.1, 13.2_

  - [x] 9.2 Verify glass-rose contact strip in `Branches.tsx`
    - Confirm strip uses `.glass-rose`, `rounded-3xl`, `border border-[#fad4db]/60`, `shadow-card-lg`, `overflow-hidden`
    - Confirm top highlight `div` is `aria-hidden` with transparent-to-blush-to-transparent gradient
    - Confirm decorative orb `div` is `aria-hidden` with `pointer-events-none` and blush radial gradient
    - Confirm `.btn-outline-rose` phone button and `.btn-rose` WhatsApp button are present
    - _Requirements: 13.3, 13.4, 13.5_

- [ ] 10. Contact — card-base contact method cards and glass-rose booking CTA panel
  - [x] 10.1 Verify contact method cards in `Contact.tsx`
    - Confirm WhatsApp, phone, and email cards each use `.card-base`, `flex items-center gap-4`, `group`
    - Confirm each icon badge uses a per-method gradient (`from-emerald-400 to-teal-500`, `grad-rose`, `from-violet-400 to-purple-500`) and `group-hover:scale-110 transition-transform duration-250`
    - _Requirements: 7.5, 7.6_

  - [x] 10.2 Verify booking CTA panel in `Contact.tsx`
    - Confirm panel uses `.glass-rose`, `rounded-3xl`, `border border-[#fad4db]/60`, `shadow-rose-lg`, `overflow-hidden`
    - Confirm top highlight `div` is `aria-hidden`
    - Confirm decorative orb `div` is `aria-hidden` with `pointer-events-none`
    - Confirm floating logo card uses `.animate-float` and `.grad-rose`
    - Confirm `.btn-rose` WhatsApp button and `.btn-outline-rose` phone button are present
    - _Requirements: 4.3, 11.4_

- [ ] 11. Footer — dark surface, hover transitions, Heart icon
  - [x] 11.1 Verify Footer dark surface and link hover transitions in `Footer.tsx`
    - Confirm `<footer>` uses `bg-[#2d1a1a] text-white`
    - Confirm social buttons use `bg-white/10 hover:bg-[#e8294a] text-[#c4a0a0] hover:text-white transition-all`
    - Confirm branch and quick links use `text-[#c4a0a0] hover:text-[#f25c74] transition-colors`
    - _Requirements: 15.1, 15.2, 15.3_

  - [x] 11.2 Verify bottom bar Heart icon and logo container in `Footer.tsx`
    - Confirm bottom bar contains `<Heart>` icon with `fill-[#e8294a]` and `text-[#e8294a]`
    - Confirm logo container uses `bg-white/10 rounded-2xl`
    - _Requirements: 15.4, 15.5_

- [ ] 12. MobileCTA — glass bar, three actions, active:scale-95, safe-area inset
  - [x] 12.1 Verify MobileCTA structure in `MobileCTA.tsx`
    - Confirm container uses `.mobile-cta-bar` and `md:hidden`
    - Confirm three actions: phone (`tel:`), WhatsApp, and `.btn-rose` booking button
    - Confirm each action has `active:scale-95`
    - Confirm `safe-area-bottom` class or `padding-bottom: env(safe-area-inset-bottom)` inline style is applied
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 19.7_

- [ ] 13. WhatsAppFAB — hover scale/glow, desktop-only visibility
  - [x] 13.1 Verify WhatsAppFAB in `WhatsAppFAB.tsx`
    - Confirm element uses `hidden md:block` (or `md:flex`) for desktop-only visibility
    - Confirm `fixed bottom-6 left-6 z-50` positioning
    - Confirm `hover:scale-110` and `hover:bg-emerald-600` transitions within `duration-200`
    - Confirm `href={CLINIC.whatsappLink}`, `target="_blank"`, `rel="noopener noreferrer"`
    - Confirm `aria-label` is present
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [x] 14. Checkpoint — verify all components render without TypeScript errors
  - Run `tsc --noEmit` to confirm zero type errors across all modified files
  - Visually verify the dev build renders the premium UI correctly
  - Ensure all decorative elements have `aria-hidden="true"` and `pointer-events-none`
  - Ensure all `<Image>` and `<img>` elements have non-empty Arabic `alt` attributes
  - _Requirements: 18.1, 18.2, 18.7_

- [ ] 15. Property-based tests — fast-check tests for CountUp and UI invariants
  - [x] 15.1 Install fast-check and set up test infrastructure
    - Install `fast-check` as a dev dependency: `npm install --save-dev fast-check`
    - Install a test runner if not present (e.g., `vitest` or `jest` with `@testing-library/react`)
    - Create `src/__tests__/premium-ui.pbt.test.ts`
    - _Requirements: 8.4, 8.5, 12.1, 12.2, 13.1, 18.7_

  - [ ]* 15.2 Write property test for CountUp sequence monotonicity and termination
    - Extract pure counting logic: `computeSequence(target: number, steps = 50): number[]`
    - **Property 1: CountUp sequence is monotonically non-decreasing and terminates at target**
    - **Validates: Requirements 8.4**
    - Generator: `fc.integer({ min: 1, max: 100000 })`
    - Assert `sequence[0] > 0`, sequence is non-decreasing, `sequence[sequence.length - 1] === target`, `sequence.length === steps`
    - Run minimum 100 iterations

  - [ ]* 15.3 Write property test for CountUp fires-once guard
    - Simulate `n` IntersectionObserver callbacks with `isIntersecting = true`
    - **Property 2: CountUp animation fires at most once regardless of intersection callback count**
    - **Validates: Requirements 8.5**
    - Generator: `fc.integer({ min: 1, max: 100000 })`, `fc.integer({ min: 1, max: 20 })` (callback count)
    - Assert animation start function called exactly once regardless of `n`
    - Run minimum 100 iterations

  - [ ]* 15.4 Write property test for testimonial avatar first character
    - **Property 3: Testimonial avatar displays the first character of the author name**
    - **Validates: Requirements 12.1**
    - Generator: `fc.string({ minLength: 1, maxLength: 50 })`
    - Render avatar with generated author name; assert rendered text content `=== author[0]`
    - Run minimum 100 iterations

  - [ ]* 15.5 Write property test for testimonial avatar gradient cycling
    - **Property 4: Testimonial avatar gradient is determined by card position modulo 3**
    - **Validates: Requirements 12.2**
    - Generator: `fc.integer({ min: 0, max: 2 })` (position), `fc.integer({ min: 0, max: 100 })` (starting idx)
    - Assert avatar at position `i` uses `AVATAR_COLORS[i]`; assert all 3 `AVATAR_COLORS` values are distinct
    - Run minimum 100 iterations

  - [ ]* 15.6 Write property test for branch accent color uniqueness
    - **Property 5: Branch accent colors are all distinct**
    - **Validates: Requirements 13.1**
    - Assert all 4 `ACCENTS[i].icon` values are distinct strings
    - Assert all 4 `ACCENTS[i].ring` values are distinct strings
    - Run minimum 100 iterations

  - [ ]* 15.7 Write property test for image alt attribute completeness
    - **Property 6: All image elements have non-empty alt attributes**
    - **Validates: Requirements 18.7**
    - Render each component containing `<Image>` or `<img>` elements
    - Assert every `img` has a non-empty, non-whitespace `alt` attribute
    - Run minimum 100 iterations

- [x] 16. Final checkpoint — all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Most components already implement the design spec — tasks are structured as verification + gap-filling
- The CountUp pure logic extraction (task 15.2) requires adding a named export `computeSequence` to `Stats.tsx` or a shared utility file
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- The `prefers-reduced-motion` block (task 1.8) must be the last rule in `globals.css` to ensure it overrides all animation definitions
