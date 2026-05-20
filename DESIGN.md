---
name: ForgeLabs Studio System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002387'
  primary-container: '#2d5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#104af0'
  secondary: '#c6c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#c9c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#6e6d6d'
  on-tertiary-container: '#f3f0ef'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0035bd'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is engineered for a high-end product studio, evoking a sense of precision, exclusivity, and technological mastery. The aesthetic is rooted in **Minimalism** with a **Tactile** edge, prioritizing clarity and "expensive" whitespace over decorative clutter. 

The personality is authoritative yet understated. It avoids the clichés of "gamer" or "hacker" dark modes, instead opting for a sophisticated "Obsidian" palette that feels like a physical luxury object—think machined aluminum and polished glass. The emotional response should be one of calm confidence and high-fidelity performance.

## Colors
This design system utilizes a tiered dark palette to create depth without relying on traditional drop shadows.

- **Backgrounds:** Use `#080808` (Obsidian) for the base canvas. Use `#0C0C0C` for elevated surface containers like cards or navigation sidebars.
- **Primary Action:** The **Electric Cobalt** (`#2D5BFF`) is the sole carrier of brand energy. Use it sparingly for primary buttons, active states, and critical highlights.
- **Typography:** The **Platinum** (`#E2E2E2`) serves as the primary text color to provide high contrast against the dark backgrounds while remaining softer on the eyes than pure white.
- **Structural:** **Graphite** (`#262626`) is dedicated to hair-line borders and subtle dividers, maintaining a rigorous grid structure.

## Typography
The typography strategy relies on **Geist** for its technical precision and neutral elegance. Its tight apertures and geometric construction reinforce the "studio" aesthetic.

- **Display & Headlines:** Use negative letter-spacing on larger sizes to create a dense, "locked-in" editorial feel.
- **Body:** Maintain generous line heights (1.6) to ensure legibility against the dark background. 
- **Labels:** **JetBrains Mono** is introduced for secondary data, metadata, and status labels to provide a subtle "engineered" contrast to the sans-serif headings. Use uppercase and increased tracking for `label-md` to denote section headers or small tags.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy for desktop to maintain the integrity of a high-end "Studio" workspace, switching to a fluid model for mobile.

- **Grid:** A 12-column grid with a 1440px max-width. Gutters are fixed at 24px to provide "breathing room" between complex data or media modules.
- **Rhythm:** Use a 4px base unit. Vertical rhythm should be generous—err on the side of more whitespace (`stack-lg`) to signal luxury.
- **Mobile:** Margins shrink to 20px, and the 12-column grid collapses to a single-column stack. High-impact display type should scale down using the `-mobile` tokens to prevent awkward wrapping.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Base Layer:** `#080808` is the "floor" of the application.
- **Secondary Layer:** Surfaces that sit "above" the floor (cards, modals, panels) use `#0C0C0C`.
- **Outlines:** All containers must feature a 1px solid border of `#262626`. This "hairline" defines the object's boundaries in a dark environment where shadows are often invisible.
- **Interactive States:** On hover, an element's border should transition to a slightly lighter grey or, for primary actions, a low-opacity Cobalt (`#2D5BFF` at 30% opacity).

## Shapes
The shape language is **Soft (Level 1)**. Elements use a 0.25rem (4px) base radius. This creates a "precision-milled" look that is approachable but remains architecturally sharp. Large cards (`rounded-lg`) should cap at 8px. Avoid fully rounded pill shapes unless used for very small, high-density tags or status chips.

## Components
- **Buttons:** 
  - *Primary:* Solid `#2D5BFF` with white text. No gradients.
  - *Secondary:* Ghost style with `#262626` border and `#E2E2E2` text.
- **Input Fields:** Background should be `#080808` (sunken) with a `#262626` border. Focus state is a 1px border of `#2D5BFF`.
- **Cards:** Background `#0C0C0C` with a 1px `#262626` border. No shadow.
- **Chips/Tags:** Use `label-sm` typography. Background should be a subtle 10% opacity of the primary Cobalt or a neutral Graphite.
- **Lists:** Items separated by 1px `#262626` horizontal rules. Hover states utilize a subtle background shift to `#141414`.
- **Glass Accents:** For floating overlays (like tooltips or dropdowns), use a background-blur effect (20px) with 80% opacity of `#0C0C0C` to maintain the "High-end Studio" feel.