# Eldomiaty Clinic — Premium Medical Website

A premium, RTL Arabic medical clinic website built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**. Features a glassmorphism design system, animated UI, and property-based tests.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-7%20passing-brightgreen)

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Language | TypeScript 5 |
| Testing | Vitest + fast-check |
| Direction | RTL (Arabic) |

---

## Features

- **Glassmorphism design system** — `.glass`, `.glass-rose`, `.glass-dark` utilities with `backdrop-filter`
- **CSS design tokens** — all colors, shadows, and spacing as CSS custom properties in `:root`
- **Animated hero** — floating orbs, halo rings, floating badges, fade-up entrance
- **Count-up stats** — `IntersectionObserver`-driven number animation, fires once per load
- **Filterable services grid** — category tabs with active/hover states
- **Video section** — custom play overlay with Facebook embed on click
- **Testimonials carousel** — gradient avatars, center card elevation, pill dot navigation
- **Scroll-aware navbar** — transparent → glass transition at 24px scroll
- **Sticky mobile CTA bar** — Call / WhatsApp / Book with iOS safe-area support
- **Desktop WhatsApp FAB** — fixed floating action button
- **`prefers-reduced-motion`** support
- **Property-based tests** — 6 correctness properties with fast-check

---

## Project Structure

```
src/
├── app/
│   ├── globals.css         # Design tokens, utility classes, keyframes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Stats.tsx
│   ├── Services.tsx
│   ├── VideoSection.tsx
│   ├── Branches.tsx
│   ├── Testimonials.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── MobileCTA.tsx
│   ├── WhatsAppFAB.tsx
│   └── SchemaOrg.tsx
├── lib/
│   ├── data.ts             # Clinic data (branches, services, testimonials)
│   └── computeSequence.ts  # Pure CountUp logic (testable)
└── __tests__/
    └── premium-ui.pbt.test.ts
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## Design System

All visual tokens are CSS custom properties defined in `src/app/globals.css`:

```css
:root {
  --rose:       #e8294a;
  --rose-light: #f25c74;
  --rose-soft:  #fce8ec;
  --rose-pale:  #fff0f3;
  --blush:      #fad4db;
  --ivory:      #fdfaf8;
  --warm-900:   #2d1a1a;
}
```

**Key utility classes:**

| Class | Purpose |
|---|---|
| `.glass` | White frosted glass surface |
| `.glass-rose` | Rose-tinted frosted glass |
| `.glass-dark` | Dark frosted glass (for colored backgrounds) |
| `.card-base` | Card with spring hover lift + glow |
| `.btn-rose` | Primary CTA button with glow |
| `.btn-outline-rose` | Secondary outlined button |
| `.grad-rose` | Rose gradient background |
| `.badge-rose` | Pill label badge |
| `.divider-rose` | Gradient section divider line |
| `.animate-orb-1/2/3` | Floating orb background animations |

---

## Testing

Property-based tests using [fast-check](https://github.com/dubzzz/fast-check) + [Vitest](https://vitest.dev):

| # | Property | Requirement |
|---|---|---|
| 1 | CountUp sequence is monotonically non-decreasing and terminates at target | 8.4 |
| 2 | CountUp animation fires at most once regardless of callback count | 8.5 |
| 3 | Testimonial avatar displays the first character of the author name | 12.1 |
| 4 | Testimonial avatar gradient is determined by card position modulo 3 | 12.2 |
| 5 | Branch accent colors are all distinct | 13.1 |
| 6 | All image elements have non-empty alt attributes | 18.7 |

```bash
npm test
# Test Files  1 passed
# Tests       7 passed
```

---

## License

MIT
