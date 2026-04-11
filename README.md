# عيادة دكتور محمد الدمياطي — Eldomiaty Clinic

موقع إلكتروني احترافي لعيادة دكتور محمد الدمياطي، استشاري أمراض النساء والتوليد والحقن المجهري والمناظير.

A premium, RTL Arabic medical clinic website built with Next.js 15, React 19, and Tailwind CSS v4.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Testing**: Vitest + fast-check (property-based testing)
- **Direction**: RTL (Arabic)

---

## Features

- Premium glassmorphism UI with animated orbs, soft gradients, and micro-interactions
- Scroll-aware glass navbar
- Hero section with floating badges, halo rings, and animated background
- Stats section with count-up animation on scroll (IntersectionObserver)
- Services grid with filterable categories and hover glow effects
- Video section with custom play overlay and Facebook embed
- Testimonials carousel with gradient avatars and center card elevation
- Branches section with per-branch accent colors
- Contact section with glass CTA panel
- Sticky mobile bottom bar (Call / WhatsApp / Book)
- Desktop floating WhatsApp FAB
- `prefers-reduced-motion` support
- WCAG AA contrast compliance

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Design tokens, utility classes, keyframes
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
│   ├── data.ts           # Clinic data, branches, services, testimonials
│   └── computeSequence.ts # Pure CountUp logic (testable)
└── __tests__/
    └── premium-ui.pbt.test.ts  # Property-based tests
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

## Clinic Info

| | |
|---|---|
| Doctor | د. محمد الدمياطي |
| Specialty | نساء · توليد · حقن مجهري |
| Phone | 01066746007 |
| Branches | التجمع الخامس · المهندسين · مدينة نصر · مدينتى |
| Facebook | [EldomiatyClinic](https://www.facebook.com/EldomiatyClinic/) |

---

## Design System

All visual tokens are defined as CSS custom properties in `globals.css`:

| Token | Value |
|---|---|
| `--rose` | `#e8294a` |
| `--rose-light` | `#f25c74` |
| `--blush` | `#fad4db` |
| `--ivory` | `#fdfaf8` |
| `--warm-900` | `#2d1a1a` |

Key utility classes: `.glass`, `.glass-rose`, `.glass-dark`, `.card-base`, `.btn-rose`, `.btn-outline-rose`, `.grad-rose`, `.badge-rose`, `.divider-rose`

---

## Testing

Property-based tests cover 6 correctness properties using [fast-check](https://github.com/dubzzz/fast-check):

1. CountUp sequence is monotonically non-decreasing and terminates at target
2. CountUp animation fires at most once regardless of intersection callback count
3. Testimonial avatar displays the first character of the author name
4. Testimonial avatar gradient is determined by card position modulo 3
5. Branch accent colors are all distinct
6. All image elements have non-empty alt attributes

```bash
npm test
# 7 tests pass
```
