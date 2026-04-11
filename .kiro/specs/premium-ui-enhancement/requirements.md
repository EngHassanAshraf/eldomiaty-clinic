# Requirements Document

## Introduction

This feature elevates the existing women's medical clinic website (Next.js/React, RTL Arabic) into a premium, high-end, slightly futuristic digital experience. The enhancement targets visual refinement — color usage, gradients, glassmorphism, micro-interactions, typography, and mobile responsiveness — without altering any existing layout structure, page content, or component hierarchy. The tone must remain premium, calming, trustworthy, and emotionally reassuring, consistent with modern healthcare branding.

The codebase consists of: `globals.css` (Tailwind v4 utility layer), and components: Navbar, Hero, Stats, About, Services, VideoSection, Testimonials, Branches, Contact, Footer, WhatsAppFAB, MobileCTA, SchemaOrg. Data lives in `src/lib/data.ts`.

---

## Glossary

- **System**: The clinic website front-end application (Next.js/React).
- **Design_Token**: A CSS custom property defined in `:root` inside `globals.css`.
- **Card**: Any `div` using the `.card-base` utility class or equivalent glass/surface container.
- **CTA_Button**: Any element using `.btn-rose` or `.btn-outline-rose`.
- **Hero_Section**: The `<Hero>` component rendered at the top of the page (`#home`).
- **Stats_Section**: The `<Stats>` component displaying count-up animated statistics.
- **About_Section**: The `<About>` component presenting doctor credentials.
- **Services_Section**: The `<Services>` component with filterable service cards.
- **Video_Section**: The `<VideoSection>` component with a Facebook video embed.
- **Testimonials_Section**: The `<Testimonials>` component with a carousel of patient reviews.
- **Branches_Section**: The `<Branches>` component listing clinic locations.
- **Contact_Section**: The `<Contact>` component with booking CTAs.
- **Navbar**: The `<Navbar>` component fixed at the top.
- **Footer**: The `<Footer>` component at the bottom.
- **MobileCTA**: The `<MobileCTA>` sticky bottom bar visible on mobile only.
- **WhatsAppFAB**: The floating WhatsApp action button visible on desktop.
- **Glassmorphism**: A visual style using semi-transparent backgrounds, `backdrop-filter: blur()`, and soft glow borders.
- **Micro-interaction**: A small, purposeful animation triggered by user action (hover, focus, scroll-into-view).
- **Count-up Animation**: A number incrementing from 0 to its target value when scrolled into view.
- **Orb**: A blurred radial-gradient circle used as a decorative background element.
- **WCAG_AA**: Web Content Accessibility Guidelines 2.1 Level AA contrast ratio (4.5:1 for normal text, 3:1 for large text).

---

## Requirements

### Requirement 1: Design Token System

**User Story:** As a developer, I want all color, shadow, and spacing values defined as CSS custom properties, so that the entire visual system is maintainable from a single source of truth.

#### Acceptance Criteria

1. THE System SHALL define all primary brand colors (`--rose`, `--rose-light`, `--rose-soft`, `--rose-pale`, `--blush`, `--ivory`) as Design_Tokens in the `:root` block of `globals.css`.
2. THE System SHALL define all shadow levels (`--shadow-soft`, `--shadow-card`, `--shadow-rose`, `--shadow-rose-xl`) as Design_Tokens.
3. THE System SHALL define all text color roles (`--text-main`, `--text-muted`, `--text-light`) as Design_Tokens.
4. WHEN a Design_Token value is changed in `:root`, THE System SHALL reflect that change across all components that reference the token without requiring per-component edits.
5. THE System SHALL not introduce any hard-coded hex color values in component files that duplicate an existing Design_Token.

---

### Requirement 2: Color Refinement — Reduced Heavy Red Backgrounds

**User Story:** As a patient visitor, I want the page to feel calming and premium rather than alarming, so that I feel emotionally reassured when browsing the clinic website.

#### Acceptance Criteria

1. THE System SHALL use the primary rose/pink color (`#e8294a` or `--rose`) exclusively for accents, CTA_Buttons, icon highlights, and text gradients — not as full-section background fills.
2. WHEN a section background is rendered, THE System SHALL use soft gradient backgrounds (ivory → rose-pale → blush range) or near-white surfaces rather than solid saturated red fills.
3. THE Stats_Section SHALL retain its gradient background but SHALL use a softened gradient that transitions from deep rose through rose-light to a light blush (`#e8294a → #f25c74 → #fce8ec`) rather than a uniform saturated red.
4. THE System SHALL maintain a minimum WCAG_AA contrast ratio of 4.5:1 between all body text and its background surface.
5. WHEN a CTA_Button is rendered on a light background, THE System SHALL apply the rose gradient (`grad-rose`) to the button while keeping the surrounding surface light-toned.

---

### Requirement 3: Gradient & Texture System

**User Story:** As a patient visitor, I want smooth, layered gradients and subtle textures throughout the page, so that the experience feels polished and premium rather than flat.

#### Acceptance Criteria

1. THE System SHALL apply a multi-layer mesh gradient to the Hero_Section background combining at least three radial gradient ellipses in the rose/blush palette.
2. THE System SHALL alternate section backgrounds between `bg-section-a` (`#fdfaf8 → #fff5f7`) and `bg-section-b` (`#fff5f7 → #fdfaf8`) to create visual rhythm.
3. THE Stats_Section SHALL overlay a subtle dot-pattern texture (white radial dots, ≤8% opacity) on top of its gradient background.
4. THE System SHALL apply a noise-texture overlay (SVG fractalNoise, ≤4% opacity) to the Stats_Section via the `.noise-overlay` utility class.
5. WHEN a section uses a gradient background, THE System SHALL add a 1px horizontal highlight line at the top edge using a transparent-to-color-to-transparent gradient to create a premium edge effect.

---

### Requirement 4: Glassmorphism Card System

**User Story:** As a patient visitor, I want cards and panels to appear as frosted glass surfaces, so that the interface feels modern, layered, and premium.

#### Acceptance Criteria

1. THE System SHALL define three glass utility classes in `globals.css`: `.glass` (white-tinted, high blur), `.glass-rose` (rose-tinted, medium blur), and `.glass-dark` (dark-tinted, for use on colored backgrounds).
2. WHEN a `.glass` element is rendered, THE System SHALL apply `backdrop-filter: blur(20px)` and a semi-transparent white background (`rgba(255,255,255,0.78)`).
3. WHEN a `.glass-rose` element is rendered, THE System SHALL apply `backdrop-filter: blur(18px)` and a semi-transparent rose-pale background (`rgba(255,245,247,0.82)`).
4. WHEN a `.glass-dark` element is rendered, THE System SHALL apply `backdrop-filter: blur(20px)` and a semi-transparent dark background (`rgba(45,26,26,0.55)`).
5. THE Hero_Section main card SHALL use the `.glass` class with a `border-white/75` border and the `.glow-rose` shadow utility.
6. THE System SHALL apply a `.glass-highlight::before` pseudo-element to glass cards to render a top-left inner highlight gradient, creating a realistic glass refraction effect.
7. WHEN a Card is hovered, THE System SHALL transition `border-color` to a rose-tinted value within 0.3s to reinforce the glass aesthetic.

---

### Requirement 5: Hero Section — Animated Premium Background

**User Story:** As a patient visitor, I want the hero section to immediately convey premium quality with animated depth, so that my first impression of the clinic is one of trust and excellence.

#### Acceptance Criteria

1. THE Hero_Section SHALL render at least three animated Orb elements as decorative background layers using `radial-gradient` fills in the rose/blush palette.
2. WHEN the page loads, THE System SHALL animate each Orb on an independent cycle (14s, 18s, 22s) using a `translate + scale` keyframe animation (`@keyframes orb`).
3. THE Hero_Section SHALL render a dot-grid overlay (radial-gradient dots, ≤2.5% opacity) as a subtle texture layer.
4. THE Hero_Section SHALL display a top-edge 1px highlight line using a transparent-to-blush-to-transparent gradient.
5. THE Hero_Section main card SHALL display two floating badge elements (positioned absolutely at `-top-4 -left-4` and `-bottom-4 -right-4`) that animate using the `.animate-float` and `.animate-float-slow` classes.
6. THE Hero_Section main card SHALL display two concentric outer ring borders (scaled at 1.07× and 1.14×) using `border-[#fad4db]` at decreasing opacity to create a halo depth effect.
7. WHEN the page loads, THE System SHALL animate the hero badge element using `.animate-fade-up` (opacity 0→1, translateY 16px→0, 0.6s ease-out).

---

### Requirement 6: CTA Button Micro-interactions

**User Story:** As a patient visitor, I want buttons to respond visually to my interactions, so that the interface feels alive and responsive.

#### Acceptance Criteria

1. THE System SHALL define `.btn-rose` with a rose gradient background, `border-radius: 0.875rem`, and a base box-shadow of `0 6px 24px rgba(232,41,74,0.30)`.
2. WHEN a `.btn-rose` element is hovered, THE System SHALL apply `translateY(-3px) scale(1.02)` and increase the box-shadow spread to `0 12px 36px rgba(232,41,74,0.40)` within 0.28s.
3. WHEN a `.btn-rose` element is active (pressed), THE System SHALL apply `translateY(-1px) scale(0.99)` to simulate a press-down effect.
4. THE System SHALL apply a `::after` pseudo-element to `.btn-rose` containing a top-left inner highlight gradient (`rgba(255,255,255,0.18) → transparent`) to create a glass-like sheen.
5. THE System SHALL define `.btn-outline-rose` with a semi-transparent white background, rose-colored text, and a `1.5px` rose-tinted border.
6. WHEN a `.btn-outline-rose` element is hovered, THE System SHALL apply `translateY(-2px)`, change background to `var(--rose-pale)`, and add a `0 4px 20px rgba(232,41,74,0.15)` box-shadow within 0.25s.
7. WHEN any interactive element receives keyboard focus, THE System SHALL display a `2px solid #e8294a` focus ring with `outline-offset: 3px` to maintain WCAG_AA keyboard accessibility.

---

### Requirement 7: Global Card System — Hover Lift & Glow

**User Story:** As a patient visitor, I want cards to subtly lift and glow when I hover over them, so that the interface feels interactive and premium.

#### Acceptance Criteria

1. THE System SHALL define `.card-base` with `background: rgba(255,255,255,0.85)`, `border: 1px solid rgba(250,212,219,0.45)`, `border-radius: 1.25rem`, and a soft base shadow.
2. THE System SHALL apply a `::before` pseudo-element to `.card-base` rendering a 1px top-edge inner highlight gradient.
3. WHEN a `.card-base` element is hovered, THE System SHALL apply `translateY(-6px)` using a `cubic-bezier(0.34,1.56,0.64,1)` spring easing within 0.32s.
4. WHEN a `.card-base` element is hovered, THE System SHALL increase box-shadow to `0 20px 50px rgba(232,41,74,0.13), 0 4px 16px rgba(45,26,26,0.08)` and transition `border-color` to `rgba(232,41,74,0.22)`.
5. THE System SHALL apply the `.card-base` class to all service cards in the Services_Section, credential rows in the About_Section, contact method cards in the Contact_Section, and branch cards in the Branches_Section.
6. WHEN a card contains an icon element, THE System SHALL apply `group-hover:scale-110` and a `transition-transform duration-250` to the icon on card hover.

---

### Requirement 8: Stats Section — Glass Cards & Count-up Animation

**User Story:** As a patient visitor, I want the statistics to animate into view and appear as premium glass cards, so that the numbers feel impactful and credible.

#### Acceptance Criteria

1. THE Stats_Section SHALL render each statistic inside a `.glass-dark` card with `border-radius: 1.5rem` and a `border: 1px solid rgba(255,255,255,0.12)`.
2. WHEN a Stats_Section card is hovered, THE System SHALL transition `border-color` to `rgba(255,255,255,0.25)` and increase box-shadow within 0.3s.
3. WHEN a Stats_Section card is hovered, THE System SHALL reveal a radial gradient inner glow (`rgba(255,255,255,0.08)`) via an absolutely-positioned overlay that transitions from `opacity: 0` to `opacity: 1`.
4. WHEN a `CountUp` component enters the viewport (≥50% visible), THE System SHALL begin incrementing the displayed number from 0 to its target value over 1600ms in 50 equal steps using `IntersectionObserver`.
5. THE System SHALL ensure the Count-up animation starts only once per page load (not re-triggered on scroll-out and back).
6. THE Stats_Section SHALL render a decorative bottom-border line on each card that expands from `width: 2.5rem` to `width: 4rem` on hover within 0.4s.

---

### Requirement 9: About Section — Visual Hierarchy & Icon Rows

**User Story:** As a patient visitor, I want the doctor's credentials to be presented with clear visual hierarchy and icon-enhanced rows, so that I can quickly assess expertise and build trust.

#### Acceptance Criteria

1. THE About_Section SHALL render each credential item as a `.card-base` row containing a gradient icon badge on the right, credential text on the left, and a hover lift effect.
2. THE System SHALL assign a distinct Lucide icon to each credential row (GraduationCap, Award, Globe, Heart) rendered inside a `grad-rose` rounded badge.
3. WHEN a credential row is hovered, THE System SHALL scale the icon badge by 1.1× within 0.25s.
4. WHEN a credential row is hovered, THE System SHALL transition the credential text color from `--text-muted` to `--text-main` within 0.2s.
5. THE About_Section SHALL render a 2×2 specialty highlight grid below the credentials, with each cell using a distinct soft gradient background and colored border matching its specialty color theme.
6. WHEN a specialty cell is hovered, THE System SHALL apply `scale(1.03)` and a soft shadow within 0.2s.

---

### Requirement 10: Services Section — Hover Elevation & Icon Glow

**User Story:** As a patient visitor, I want service cards to respond to hover with icon glow and elevation, so that browsing services feels engaging and premium.

#### Acceptance Criteria

1. THE Services_Section SHALL render each service as a `.card-base` card with a centered emoji icon, service title, and category badge.
2. WHEN a service card is hovered, THE System SHALL apply `drop-shadow(0 4px 8px rgba(232,41,74,0.30))` to the icon element within 0.3s.
3. WHEN a service card is hovered, THE System SHALL scale the icon by 1.15× within 0.3s.
4. WHEN a service card is hovered, THE System SHALL transition the title text color from `--warm-700` to `--warm-900` within 0.2s.
5. THE Services_Section filter tabs SHALL use the `.grad-rose` class for the active state and a white/rose-pale background for inactive states.
6. WHEN an inactive filter tab is hovered, THE System SHALL transition its border color to `rgba(232,41,74,0.50)` and text color to `#e8294a` within 0.25s.
7. THE Services_Section SHALL render a booking CTA button below the grid using `.btn-rose` with `px-8 py-4` padding.

---

### Requirement 11: Video Section — Rounded Card with Glow Border

**User Story:** As a patient visitor, I want the video section to appear as a premium media card with a soft glow border, so that it feels intentional and high-quality.

#### Acceptance Criteria

1. THE Video_Section card SHALL use `border-radius: 1.5rem`, `overflow: hidden`, and the `.shadow-rose-xl` shadow utility.
2. THE Video_Section card SHALL have a `border: 1px solid rgba(250,212,219,0.50)` to create a soft glow border effect.
3. THE Video_Section card SHALL render a 1px top-edge highlight line using a transparent-to-blush-to-transparent gradient.
4. WHEN the video is not yet playing, THE Video_Section SHALL display a custom overlay with animated Orb backgrounds, a floating logo card, doctor name, subtitle, and a `.btn-rose` play button.
5. WHEN the play button is clicked, THE System SHALL replace the overlay with the embedded Facebook video iframe.
6. THE Video_Section play button SHALL use the `.animate-pulse-rose` animation to draw attention.
7. THE Video_Section SHALL render a bottom info bar with the doctor's name and a link to open the video on Facebook.

---

### Requirement 12: Testimonials Section — Avatar Initials & Smooth Carousel

**User Story:** As a patient visitor, I want testimonials to display avatar initials and smooth carousel transitions, so that reviews feel personal and credible.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL render each testimonial card with a gradient avatar circle displaying the first letter of the patient's name.
2. THE System SHALL assign one of three gradient color schemes to avatar circles based on card position (index 0, 1, 2) cycling through rose-to-rose-light, rose-light-to-blush, and deep-rose-to-rose.
3. THE center testimonial card (index 1 of 3 visible) SHALL be visually elevated: `scale(1.04)`, stronger shadow (`.shadow-rose-lg`), and a top accent line using `.grad-rose`.
4. THE non-center testimonial cards SHALL render at `scale(0.98)` and `opacity: 0.90` to create depth hierarchy.
5. THE Testimonials_Section SHALL render navigation controls: previous/next buttons using `.glass` style, and dot indicators where the active dot expands to a pill shape (`width: 1.75rem`) using `.grad-rose`.
6. WHEN a dot indicator is clicked, THE System SHALL navigate directly to the corresponding testimonial set.
7. THE Testimonials_Section SHALL render a `<Quote>` icon (rotated 180°) in blush color at the top of each card.

---

### Requirement 13: Branches Section — Accent Colors & Contact Strip

**User Story:** As a patient visitor, I want each branch card to have a distinct accent color and a prominent contact strip below, so that I can quickly identify and contact the nearest branch.

#### Acceptance Criteria

1. THE Branches_Section SHALL render each branch card using `.card-base` with a unique accent color scheme (rose, amber, emerald, violet) applied to the icon badge, top accent line, and border.
2. WHEN a branch card icon badge is hovered, THE System SHALL scale it by 1.1× within 0.25s.
3. THE Branches_Section SHALL render a contact strip below the branch grid using `.glass-rose` with a top-edge highlight line and a decorative Orb background element.
4. THE contact strip SHALL contain a headline, subtitle, a `.btn-outline-rose` phone button, and a `.btn-rose` WhatsApp button.
5. WHEN the contact strip WhatsApp button is hovered, THE System SHALL apply the standard `.btn-rose` hover effect (`translateY(-3px) scale(1.02)`).

---

### Requirement 14: Navbar — Scroll-aware Glass Effect

**User Story:** As a patient visitor, I want the navbar to transition to a glass style when I scroll down, so that it remains readable while feeling premium and non-intrusive.

#### Acceptance Criteria

1. WHEN the page scroll position is 0, THE Navbar SHALL render with a transparent background and no shadow.
2. WHEN the page scroll position exceeds 24px, THE Navbar SHALL transition to a `.glass` background with a `shadow-soft` shadow and a `border-b border-rose-100/60` bottom border within 0.3s.
3. THE Navbar SHALL display the clinic logo, doctor name, and specialty subtitle on screens ≥640px wide.
4. THE Navbar SHALL display a `.btn-rose` booking CTA button on screens ≥768px wide.
5. WHEN the mobile menu toggle is activated, THE Navbar SHALL render a `.glass` dropdown menu with nav links and a full-width WhatsApp booking button.
6. WHEN a nav link is hovered, THE System SHALL transition its color to `#e8294a` and background to `#fff0f3` within 0.2s.

---

### Requirement 15: Footer — Dark Premium Surface

**User Story:** As a patient visitor, I want the footer to feel like a premium dark surface that completes the page, so that the overall experience feels cohesive and finished.

#### Acceptance Criteria

1. THE Footer SHALL use `background: #2d1a1a` (deep warm dark) as its surface color.
2. THE Footer SHALL render social media icon buttons that transition from `bg-white/10` to `bg-[#e8294a]` on hover within 0.2s.
3. THE Footer SHALL render branch links and quick links that transition from `text-[#c4a0a0]` to `text-[#f25c74]` on hover within 0.2s.
4. THE Footer SHALL display a bottom bar with copyright text and a "made with love" line containing a filled rose Heart icon.
5. THE Footer SHALL render the clinic logo inside a `bg-white/10` rounded container.

---

### Requirement 16: MobileCTA — Sticky Bottom Bar

**User Story:** As a mobile patient visitor, I want a persistent bottom action bar with call, WhatsApp, and booking options, so that I can always reach the clinic with one tap.

#### Acceptance Criteria

1. THE MobileCTA SHALL be visible only on screens narrower than 768px (`md:hidden`).
2. THE MobileCTA SHALL be fixed to the bottom of the viewport with `z-index: 40`, a `.glass` background, and a `border-top: 1px solid rgba(250,212,219,0.60)` separator.
3. THE MobileCTA SHALL render three action items: a phone call link, a WhatsApp link, and a `.btn-rose` booking button.
4. WHEN a MobileCTA action item is tapped, THE System SHALL apply `scale(0.95)` via `active:scale-95` to provide tactile feedback.
5. THE MobileCTA SHALL apply `box-shadow: 0 -4px 24px rgba(45,26,26,0.10)` to visually separate it from page content.

---

### Requirement 17: Spacing, Typography & Visual Hierarchy

**User Story:** As a patient visitor, I want generous whitespace, strong typographic hierarchy, and consistent section headers, so that the content is easy to scan and feels premium.

#### Acceptance Criteria

1. THE System SHALL apply `section-padding` (`padding-top: 5.5rem; padding-bottom: 5.5rem`) to all main content sections.
2. THE System SHALL define a `.section-header` utility applying `text-align: center` and `margin-bottom: 3.5rem` for consistent section introductions.
3. THE System SHALL define a `.badge-rose` utility for section label badges with rose-tinted gradient background, rose text, and a pill border-radius.
4. THE System SHALL define a `.divider-rose` utility rendering a 3.5rem wide, 3px tall gradient line (`#e8294a → #f9a8b4 → transparent`) centered below section titles.
5. THE System SHALL use `font-family: "Tajawal", "Segoe UI", sans-serif` as the global body font with `direction: rtl`.
6. THE System SHALL apply `line-height: 1.8` to body paragraph text and `line-height: 1.12` to large display headings.
7. THE System SHALL apply `-webkit-font-smoothing: antialiased` globally for crisp text rendering.

---

### Requirement 18: Animation Performance & Accessibility

**User Story:** As a patient visitor using any device or assistive technology, I want animations to be smooth and non-distracting, and the interface to remain fully accessible, so that I can use the site comfortably regardless of my needs or device.

#### Acceptance Criteria

1. THE System SHALL define all decorative Orb elements with `aria-hidden="true"` and `pointer-events: none` to exclude them from the accessibility tree.
2. THE System SHALL define all decorative overlay elements (dot grids, noise textures, highlight lines) with `aria-hidden="true"`.
3. WHEN a user activates the `prefers-reduced-motion` media query, THE System SHALL reduce or eliminate all keyframe animations (float, orb, pulse, fade-up) to respect the user's motion preference.
4. THE System SHALL limit all transition durations to a maximum of 0.5s to prevent sluggish interactions.
5. THE System SHALL use `cubic-bezier(0.34,1.56,0.64,1)` spring easing for card lift animations and `ease` or `ease-out` for opacity/color transitions.
6. THE System SHALL not use `will-change` on more than 4 elements simultaneously to avoid GPU memory pressure.
7. WHEN an image element is rendered, THE System SHALL include a descriptive `alt` attribute in Arabic for screen reader compatibility.
8. THE System SHALL maintain `scroll-behavior: smooth` on the `html` element for anchor navigation.

---

### Requirement 19: Responsive Mobile Enhancements

**User Story:** As a mobile patient visitor, I want all premium enhancements to work correctly on small screens, so that the experience is equally polished on my phone.

#### Acceptance Criteria

1. THE Hero_Section SHALL use a single-column layout on screens narrower than 1024px, with the card column rendered above the text column.
2. THE Stats_Section SHALL use a 2-column grid on screens narrower than 1024px.
3. THE Services_Section grid SHALL use 2 columns on screens narrower than 640px, 3 columns on screens 640px–767px, 4 columns on screens 768px–1023px, and 5 columns on screens ≥1024px.
4. THE Branches_Section SHALL use a 2-column grid on screens ≥640px and a 4-column grid on screens ≥1024px.
5. THE Testimonials_Section SHALL render all 3 visible cards in a single-column stack on screens narrower than 768px.
6. THE System SHALL apply `overflow-x: hidden` to the `body` element to prevent horizontal scroll caused by decorative Orb elements.
7. THE MobileCTA SHALL account for iOS safe-area insets using `padding-bottom: env(safe-area-inset-bottom)` or equivalent.

---

### Requirement 20: WhatsApp FAB — Desktop Floating Button

**User Story:** As a desktop patient visitor, I want a persistent floating WhatsApp button, so that I can initiate a booking conversation at any point while browsing.

#### Acceptance Criteria

1. THE WhatsAppFAB SHALL be visible only on screens ≥768px wide.
2. THE WhatsAppFAB SHALL be fixed to the bottom-right corner of the viewport with `z-index: 50`.
3. WHEN the WhatsAppFAB is hovered, THE System SHALL apply a scale or glow transition within 0.25s.
4. THE WhatsAppFAB SHALL link to the clinic's WhatsApp URL (`CLINIC.whatsappLink`) opening in a new tab with `rel="noopener noreferrer"`.
