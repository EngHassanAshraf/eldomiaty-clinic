# Design Document — premium-ui-enhancement

## Overview

This design covers the visual enhancement of the existing El-Domiaty Clinic website (Next.js 15, React, Tailwind v4, RTL Arabic). The goal is to elevate the UI to a premium, slightly futuristic aesthetic — glassmorphism surfaces, animated orbs, micro-interactions, count-up statistics, and a cohesive design-token system — without changing any layout structure, page content, component hierarchy, or data.

All changes are confined to:
1. `src/app/globals.css` — CSS custom properties, utility classes, keyframes
2. Existing component files — class names, JSX structure for decorative elements, and the `useCountUp` hook logic

No new components, routes, or data files are introduced.

---

## Architecture

The enhancement follows a **CSS-first, token-driven** approach:

```
globals.css  ←  single source of truth for all design tokens, utilities, animations
     ↓
Component files  ←  consume tokens via Tailwind utility classes and CSS custom properties
     ↓
useCountUp hook  ←  pure logic hook, no external dependencies
```

### Key Architectural Decisions

- **No new files**: All CSS lives in `globals.css`; the `useCountUp` hook is inlined in `Stats.tsx` (already the pattern used).
- **Tailwind v4 `@layer utilities`**: All custom classes are defined inside `@layer utilities` so Tailwind's JIT can tree-shake unused rules.
- **CSS custom properties over Tailwind config**: Brand tokens are defined in `:root` so they are accessible from both CSS and inline styles without a `tailwind.config.js` change.
- **`IntersectionObserver` for CountUp**: Avoids scroll-event polling; fires once via a `hasStarted` ref guard.
- **`prefers-reduced-motion` override**: A single `@media` block at the end of `globals.css` sets all animation/transition to `none` or `reduce`.

---

## Components and Interfaces

### Navbar

**File**: `src/components/Navbar.tsx`

Already implements scroll-aware glass transition. The design confirms and locks the behavior:

- `useEffect` adds a `scroll` listener; sets `scrolled = window.scrollY > 24`.
- `scrolled === false` → `bg-transparent py-4`
- `scrolled === true` → `glass shadow-soft py-2 border-b border-rose-100/60`
- Transition: `transition-all duration-300` on the `<header>` element.
- Mobile menu: renders a `glass` dropdown when `open === true`.

No changes needed — the component already matches the design spec.

---

### Hero

**File**: `src/components/Hero.tsx`

Already implements the full spec. Design confirms:

| Element | Class / Implementation |
|---|---|
| Section bg | `bg-hero-premium` (multi-layer radial mesh) |
| Orb 1 | `animate-orb-1`, 14s cycle, top-right |
| Orb 2 | `animate-orb-2`, 18s cycle reverse, bottom-left |
| Orb 3 | `animate-orb-3`, 22s cycle, mid-left |
| Dot grid | `opacity-[0.022]`, `radial-gradient` 36px grid |
| Top highlight | 1px `bg-gradient-to-r` transparent→blush→transparent |
| Main card | `.glass`, `border-white/75`, `.glow-rose`, `.shadow-rose-xl` |
| Floating badge 1 | `-top-4 -left-4`, `.animate-float-delayed` |
| Floating badge 2 | `-bottom-4 -right-4`, `.animate-float-slow` |
| Halo rings | `scale-[1.07]` and `scale-[1.14]`, `border-[#fad4db]` |
| Hero badge | `.animate-fade-up` |

All `aria-hidden="true"` and `pointer-events-none` on decorative elements.

---

### Stats

**File**: `src/components/Stats.tsx`

Already implements the full spec. Design confirms:

- Section background: layered `grad-stats` + softened overlay (`rgba(232,41,74,0.92) → rgba(242,92,116,0.88) → rgba(249,168,180,0.80)`)
- Dot pattern: `opacity-[0.08]`, white 1px dots, 26px grid
- Noise overlay: `.noise-overlay` class (SVG fractalNoise via `::after`)
- Stat cards: `.glass-dark`, `rounded-3xl`, `border border-white/12`
- Hover glow: absolutely-positioned radial gradient overlay, `opacity-0 group-hover:opacity-100`
- Bottom accent line: `w-10 group-hover:w-16`, `bg-white/25 group-hover:bg-white/50`, `transition-all duration-400`
- `CountUp` hook: inline in `Stats.tsx`, uses `IntersectionObserver` with `threshold: 0.5`, `hasStarted` ref

**CountUp hook interface** (see dedicated section below).

---

### About

**File**: `src/components/About.tsx`

Already implements the full spec. Design confirms:

- Credential rows: `.card-base`, `grad-rose` icon badge, Lucide icons (GraduationCap, Award, Globe, Heart)
- Icon badge hover: `group-hover:scale-110 transition-transform duration-250`
- Text hover: `group-hover:text-[#2d1a1a] transition-colors`
- 2×2 specialty grid: 4 cells with distinct soft gradient backgrounds and colored borders

---

### Services

**File**: `src/components/Services.tsx`

Already implements the full spec. Design confirms:

- Service cards: `.card-base`, centered emoji icon, title, category badge
- Icon hover: `group-hover:scale-115`, `group-hover:drop-shadow-[0_4px_8px_rgba(232,41,74,0.30)]`
- Active filter tab: `grad-rose text-white shadow-rose scale-[1.04]`
- Inactive tab hover: `hover:border-[#e8294a]/50 hover:text-[#e8294a]`
- Booking CTA: `.btn-rose px-8 py-4`

---

### VideoSection

**File**: `src/components/VideoSection.tsx`

Already implements the full spec. Design confirms:

- Card: `rounded-3xl overflow-hidden shadow-rose-xl border border-[#fad4db]/50`
- Top highlight: 1px gradient line, `z-10`
- Pre-play overlay: 2 orbs, floating logo card (`.animate-float`), doctor name, subtitle, `.btn-rose` play button with `.animate-pulse-rose`
- On play click: `setPlaying(true)` → renders Facebook `<iframe>`
- Bottom bar: doctor name badge + "open on Facebook" link

---

### Testimonials

**File**: `src/components/Testimonials.tsx`

Already implements the full spec. Design confirms:

- Avatar: gradient circle, first letter of `t.author`, colors from `AVATAR_COLORS[i % 3]`
- Center card (i===1): `scale-[1.04]`, `.shadow-rose-lg`, top accent line `.grad-rose`
- Side cards: `scale-[0.98] opacity-90`
- Nav buttons: `.glass border border-[#fad4db]/70`
- Active dot: `w-7 h-2.5 grad-rose` (pill shape)
- Quote icon: `rotate-180`, `text-[#fad4db]`

---

### Branches

**File**: `src/components/Branches.tsx`

Already implements the full spec. Design confirms:

| Branch | Accent |
|---|---|
| التجمع الخامس | rose (`grad-rose`, `border-[#fad4db]/70`) |
| المهندسين | amber (`from-orange-400 to-amber-400`, `border-[#fde8c8]/70`) |
| مدينة نصر | emerald (`from-emerald-400 to-teal-400`, `border-[#c8f0e0]/70`) |
| مدينتى | violet (`from-violet-400 to-purple-500`, `border-[#d8c8f8]/70`) |

- Contact strip: `.glass-rose`, top highlight, decorative orb, `.btn-outline-rose` + `.btn-rose`

---

### Contact

**File**: `src/components/Contact.tsx`

Already implements the full spec. Design confirms:

- Contact method cards: `.card-base`, icon badge with per-method gradient, hover scale on icon
- Booking CTA panel: `.glass-rose`, top highlight, decorative orb, `.animate-float` logo card, `.btn-rose` + `.btn-outline-rose`

---

### Footer

**File**: `src/components/Footer.tsx`

Already implements the full spec. Design confirms:

- Background: `bg-[#2d1a1a]`
- Social buttons: `bg-white/10 hover:bg-[#e8294a]`, `text-[#c4a0a0] hover:text-white`
- Links: `text-[#c4a0a0] hover:text-[#f25c74]`
- Bottom bar: `Heart` icon with `fill-[#e8294a]`
- Logo container: `bg-white/10 rounded-2xl`

---

### MobileCTA

**File**: `src/components/MobileCTA.tsx`

Already implements the full spec. Design confirms:

- Visibility: `md:hidden`
- Container: `.mobile-cta-bar` utility (glass bg, `border-top`, `box-shadow: 0 -4px 24px rgba(45,26,26,0.10)`, `z-index: 40`)
- 3 actions: phone (`tel:`), WhatsApp, `.btn-rose` booking
- Tap feedback: `active:scale-95` on each action
- Safe area: `padding-bottom: env(safe-area-inset-bottom)` via `safe-area-bottom` utility or inline style

---

### WhatsAppFAB

**File**: `src/components/WhatsAppFAB.tsx`

Already implements the full spec. Design confirms:

- Visibility: `hidden md:block` (desktop only)
- Position: `fixed bottom-6 left-6 z-50`
- Hover: `hover:scale-110`, `hover:bg-emerald-600`, glow shadow
- Link: `CLINIC.whatsappLink`, `target="_blank"`, `rel="noopener noreferrer"`

---

## Data Models

No new data models are introduced. All data continues to flow from `src/lib/data.ts`.

### Design Token Map

All tokens are CSS custom properties defined in `:root` in `globals.css`:

```
Color tokens:
  --rose:        #e8294a   (primary brand red-rose)
  --rose-light:  #f25c74   (lighter rose for gradients)
  --rose-soft:   #fce8ec   (soft rose tint)
  --rose-pale:   #fff0f3   (near-white rose)
  --blush:       #fad4db   (blush pink for borders/highlights)
  --ivory:       #fdfaf8   (warm white page background)
  --warm-50:     #faf7f5
  --warm-100:    #f5ede9
  --warm-200:    #ecddd8
  --warm-700:    #6b4c4c   (muted warm text)
  --warm-900:    #2d1a1a   (deep warm dark, headings)

Text role tokens:
  --text-main:   #2d1a1a
  --text-muted:  #8a6a6a
  --text-light:  #c4a0a0
```

### CSS Utility Class Inventory

All defined in `@layer utilities` in `globals.css`:

**Backgrounds**
- `.bg-ivory`, `.bg-rose-pale`, `.bg-rose-soft`
- `.bg-hero-premium` — multi-layer radial mesh gradient
- `.bg-section-a` — `linear-gradient(180deg, #fdfaf8 0%, #fff5f7 100%)`
- `.bg-section-b` — `linear-gradient(180deg, #fff5f7 0%, #fdfaf8 100%)`

**Glass**
- `.glass` — `rgba(255,255,255,0.78)`, `blur(20px) saturate(1.4)`
- `.glass-rose` — `rgba(255,245,247,0.82)`, `blur(18px) saturate(1.3)`
- `.glass-dark` — `rgba(45,26,26,0.55)`, `blur(20px) saturate(1.2)`
- `.glass-highlight::before` — top-left inner refraction gradient

**Gradients**
- `.grad-rose` — `linear-gradient(135deg, #e8294a 0%, #f25c74 55%, #f9a8b4 100%)`
- `.grad-rose-soft`, `.grad-hero`, `.grad-section`, `.grad-stats`

**Text gradient**
- `.text-grad-rose` — `background-clip: text`, `-webkit-text-fill-color: transparent`

**Shadows**
- `.shadow-rose`, `.shadow-rose-lg`, `.shadow-rose-xl`
- `.shadow-soft`, `.shadow-card`, `.shadow-card-lg`
- `.glow-rose`, `.glow-rose-sm`

**Cards**
- `.card-base` — white/85 bg, blush border, 1.25rem radius, soft shadow, spring hover lift
- `.card-hover` — legacy compat alias

**Buttons**
- `.btn-rose` — rose gradient, 0.875rem radius, spring hover, `::after` sheen
- `.btn-outline-rose` — white/85 bg, rose border, rose text, hover rose-pale bg

**Badges & Dividers**
- `.badge-rose` — pill, rose-tinted gradient bg, rose text
- `.divider-rose` — 3.5rem × 3px gradient line

**Layout**
- `.section-padding` — `pt-[5.5rem] pb-[5.5rem]`
- `.section-header` — `text-align: center; margin-bottom: 3.5rem`

**Texture**
- `.noise-overlay::after` — SVG fractalNoise pseudo-element

**Mobile**
- `.mobile-cta-bar` — fixed bottom bar, glass bg, border-top, shadow

**Animations**
- `.animate-float`, `.animate-float-slow`, `.animate-float-delayed`
- `.animate-pulse-rose`
- `.animate-fade-up`
- `.animate-shimmer`, `.animate-count`
- `.animate-orb-1`, `.animate-orb-2`, `.animate-orb-3`

---

## CountUp Hook Design

The `CountUp` component is defined inline in `Stats.tsx`. Its interface:

```typescript
function CountUp({ target, suffix }: { target: number; suffix: string }): JSX.Element
```

**Internal state and refs:**
- `count: number` — displayed value, starts at 0
- `ref: RefObject<HTMLDivElement>` — attached to the root element for `IntersectionObserver`
- `started: RefObject<boolean>` — guards against re-triggering (fires once per mount)

**Algorithm:**

```
useEffect(() => {
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !started.current) {
      started.current = true
      const duration = 1600   // ms
      const steps = 50
      const inc = target / steps
      let cur = 0
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, target)
        setCount(Math.round(cur))
        if (cur >= target) clearInterval(timer)
      }, duration / steps)    // 32ms per step
    }
  }, { threshold: 0.5 })
  obs.observe(ref.current)
  return () => obs.disconnect()
}, [target])
```

**Properties guaranteed by the algorithm:**
1. First displayed value after start: `Math.round(target / 50)` (≥ 1 for any target ≥ 1)
2. Final displayed value: `target` (clamped by `Math.min`)
3. Sequence is monotonically non-decreasing (each step adds `inc > 0`)
4. Total steps: exactly 50 (timer clears when `cur >= target`)
5. `started.current` is set to `true` before the interval starts → subsequent `isIntersecting` callbacks are no-ops

**Signature for extraction (if needed):**

```typescript
function useCountUp(target: number, duration: number, steps: number): {
  count: number;
  ref: RefObject<HTMLDivElement>;
}
```

This signature allows the hook to be extracted and unit-tested independently of the component.

---

## Animation System

### @keyframes Definitions

All defined in `@layer utilities` in `globals.css`:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-8px) rotate(0.5deg); }
  66%       { transform: translateY(-4px) rotate(-0.5deg); }
}

@keyframes orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 15px) scale(0.97); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulseRose {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,41,74,0.40); }
  50%       { box-shadow: 0 0 0 10px rgba(232,41,74,0); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes countIn {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
```

### Animation Class Assignments

| Class | Keyframe | Duration | Delay | Direction |
|---|---|---|---|---|
| `.animate-float` | `float` | 7s | 0s | normal |
| `.animate-float-slow` | `float` | 11s | 0s | normal |
| `.animate-float-delayed` | `float` | 8s | 2s | normal |
| `.animate-pulse-rose` | `pulseRose` | 2.8s | 0s | normal |
| `.animate-fade-up` | `fadeUp` | 0.6s | 0s | forwards |
| `.animate-shimmer` | `shimmer` | 2.5s | 0s | linear infinite |
| `.animate-count` | `countIn` | 0.6s | 0s | forwards |
| `.animate-orb-1` | `orb` | 14s | 0s | normal |
| `.animate-orb-2` | `orb` | 18s | 3s | reverse |
| `.animate-orb-3` | `orb` | 22s | 6s | normal |

### prefers-reduced-motion Override

At the end of `globals.css`, after all utility definitions:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This single block overrides all animations and transitions for users who have requested reduced motion, without requiring per-class overrides.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The feature is primarily CSS/visual enhancement. Most acceptance criteria are static configuration checks (SMOKE) or specific structural checks (EXAMPLE). However, the following universal properties emerge from the logic-bearing parts of the system: the `CountUp` hook, the testimonial avatar rendering, the branch accent color mapping, and the accessibility constraints.

Property-based testing library: **fast-check** (TypeScript, works with Jest/Vitest, no external runtime dependencies).

---

### Property 1: CountUp sequence is monotonically non-decreasing and terminates at target

*For any* positive integer `target` and any `steps` value ≥ 1, the sequence of values produced by the CountUp algorithm should be monotonically non-decreasing, start at a value > 0 after the first step, and end exactly at `target` after `steps` steps.

**Validates: Requirements 8.4**

---

### Property 2: CountUp animation fires at most once regardless of intersection callback count

*For any* target value, if the `IntersectionObserver` callback fires `n` times with `isIntersecting = true` (where n ≥ 1), the count-up animation should start exactly once — the `started` ref prevents any subsequent re-trigger.

**Validates: Requirements 8.5**

---

### Property 3: Testimonial avatar displays the first character of the author name

*For any* testimonial object with a non-empty `author` string, the rendered avatar circle should display exactly `author[0]` (the first character of the author's name).

**Validates: Requirements 12.1**

---

### Property 4: Testimonial avatar gradient is determined by card position modulo 3

*For any* set of visible testimonials and any card position index `i` (0, 1, or 2), the avatar gradient class applied should equal `AVATAR_COLORS[i % 3]`, ensuring the three-color cycle holds for any starting index.

**Validates: Requirements 12.2**

---

### Property 5: Branch accent colors are all distinct

*For any* rendering of the Branches section, the four branch cards should each receive a distinct accent color scheme — no two cards should share the same icon gradient class, ensuring visual differentiation across all branches.

**Validates: Requirements 13.1**

---

### Property 6: All image elements have non-empty alt attributes

*For any* component in the system that renders an `<img>` or Next.js `<Image>` element, the `alt` attribute should be a non-empty string, ensuring screen reader compatibility for all visual content.

**Validates: Requirements 18.7**

---

## Error Handling

This feature is purely visual/CSS — there are no network calls, async operations, or user-input validation paths introduced. Error handling considerations:

1. **`IntersectionObserver` unavailability**: The `CountUp` hook's `useEffect` accesses `ref.current` before calling `obs.observe`. If `ref.current` is null (e.g., component unmounted before effect runs), the early return guard `if (!el) return` prevents a crash.

2. **`backdrop-filter` unsupported browsers**: The `.glass` classes include both `-webkit-backdrop-filter` and `backdrop-filter` for Safari compatibility. On browsers that support neither, the element falls back to its `background` color (semi-transparent white/rose), which remains readable.

3. **`IntersectionObserver` cleanup**: The `useEffect` returns `() => obs.disconnect()` to prevent memory leaks when the `Stats` component unmounts.

4. **Animation on low-power devices**: The `prefers-reduced-motion` override eliminates all animations, preventing jank on low-power devices where CSS animations may cause frame drops.

5. **RTL layout**: All absolute-positioned decorative elements (orbs, badges) use directional positioning (`right`, `left`) that is already correct for RTL. No `transform: scaleX(-1)` hacks are needed since the decorative elements are symmetric.

---

## Testing Strategy

### Dual Testing Approach

**Unit/Example tests** verify specific structural and behavioral requirements:
- Component renders with correct CSS classes (card-base, glass, grad-rose, etc.)
- Navbar renders transparent at scroll=0 and glass at scroll>24
- VideoSection shows overlay initially, shows iframe after play click
- Testimonials center card has elevated classes
- CountUp renders 0 initially and target value after animation completes
- All image elements have non-empty alt attributes
- `prefers-reduced-motion` CSS block exists in globals.css

**Property-based tests** verify universal properties using **fast-check**:
- Each property test runs minimum **100 iterations**
- Tag format: `Feature: premium-ui-enhancement, Property {N}: {property_text}`

### Property Test Specifications

**Property 1 — CountUp sequence**
```
Tag: Feature: premium-ui-enhancement, Property 1: CountUp sequence is monotonically non-decreasing and terminates at target
Generator: fc.integer({ min: 1, max: 100000 })
Test: Extract the pure counting logic from CountUp into a testable function
      computeSequence(target, steps=50) → number[]
      Assert: sequence[0] > 0
      Assert: sequence is monotonically non-decreasing (sequence[i+1] >= sequence[i])
      Assert: sequence[sequence.length - 1] === target
      Assert: sequence.length === steps
```

**Property 2 — CountUp fires once**
```
Tag: Feature: premium-ui-enhancement, Property 2: CountUp animation fires at most once
Generator: fc.integer({ min: 1, max: 100000 }), fc.integer({ min: 1, max: 20 }) (callback count)
Test: Simulate n IntersectionObserver callbacks with isIntersecting=true
      Assert: started.current is true after first callback
      Assert: animation start function called exactly once regardless of n
```

**Property 3 — Avatar first character**
```
Tag: Feature: premium-ui-enhancement, Property 3: Testimonial avatar displays first character of author name
Generator: fc.string({ minLength: 1, maxLength: 50 }) (author name)
Test: Render avatar with generated author name
      Assert: rendered text content === author[0]
```

**Property 4 — Avatar gradient by position**
```
Tag: Feature: premium-ui-enhancement, Property 4: Testimonial avatar gradient determined by position mod 3
Generator: fc.integer({ min: 0, max: 2 }) (position index), fc.integer({ min: 0, max: 100 }) (starting idx)
Test: Compute visible = [0,1,2].map(offset => TESTIMONIALS[(idx + offset) % TESTIMONIALS.length])
      Assert: avatar at position i uses AVATAR_COLORS[i]
      Assert: AVATAR_COLORS[0] !== AVATAR_COLORS[1] !== AVATAR_COLORS[2] (all distinct)
```

**Property 5 — Branch accent colors distinct**
```
Tag: Feature: premium-ui-enhancement, Property 5: Branch accent colors are all distinct
Generator: No random input needed — ACCENTS array is fixed
Test: Assert all 4 ACCENTS[i].icon values are distinct strings
      Assert all 4 ACCENTS[i].ring values are distinct strings
      (This is a static invariant, run once but framed as a property)
```

**Property 6 — Image alt attributes non-empty**
```
Tag: Feature: premium-ui-enhancement, Property 6: All image elements have non-empty alt attributes
Generator: Render each component that contains Image elements
Test: Query all img elements in rendered output
      Assert: every img has alt attribute
      Assert: every alt attribute is a non-empty string (length > 0)
      Assert: alt attribute is not just whitespace
```

### Unit Test Coverage Targets

| Area | Test Type | Key Assertions |
|---|---|---|
| globals.css token definitions | Snapshot | :root contains all required custom properties |
| globals.css utility classes | Snapshot | .glass, .glass-rose, .glass-dark, .card-base, .btn-rose, .btn-outline-rose, .badge-rose, .divider-rose defined |
| globals.css animations | Snapshot | @keyframes orb, float, fadeUp, pulseRose defined |
| globals.css reduced-motion | Example | @media (prefers-reduced-motion: reduce) block exists |
| Navbar scroll=0 | Example | bg-transparent class present |
| Navbar scroll>24 | Example | glass class present |
| Navbar mobile menu | Example | glass dropdown renders on open=true |
| Stats CountUp initial | Example | renders "0" initially |
| Stats CountUp after animation | Example | renders target value after 1600ms |
| VideoSection initial | Example | overlay visible, iframe absent |
| VideoSection after play | Example | iframe visible, overlay absent |
| Testimonials center card | Example | scale-[1.04] and shadow-rose-lg on index 1 |
| Testimonials dot navigation | Example | clicking dot i sets idx to i |
| Footer Heart icon | Example | Heart icon present in bottom bar |
| MobileCTA three actions | Example | phone, WhatsApp, booking button present |
| WhatsAppFAB link | Example | href=CLINIC.whatsappLink, target=_blank, rel=noopener noreferrer |
