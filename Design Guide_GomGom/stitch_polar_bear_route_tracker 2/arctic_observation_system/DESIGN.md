---
name: Arctic Observation System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#414755'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#566068'
  on-secondary: '#ffffff'
  secondary-container: '#dae4ee'
  on-secondary-container: '#5c666e'
  tertiary: '#5a5c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#737577'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#dae4ee'
  secondary-fixed-dim: '#bec8d1'
  on-secondary-fixed: '#131d24'
  on-secondary-fixed-variant: '#3e4850'
  tertiary-fixed: '#e2e2e5'
  tertiary-fixed-dim: '#c6c6c9'
  on-tertiary-fixed: '#1a1c1e'
  on-tertiary-fixed-variant: '#454749'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter-mobile: 16px
  gutter-desktop: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in the intersection of **Scientific Precision** and **Expeditionary Aesthetics**. It captures the stark, expansive atmosphere of the Arctic through a minimalist lens, evoking a sense of calm, focus, and environmental stewardship. The target audience includes researchers, conservationists, and citizen scientists who require high legibility and functional clarity in potentially high-glare or low-light conditions.

The visual style is a blend of **Minimalism** and **Modern Brutalism**, utilizing:
- **Scientific Blueprinting:** High-contrast charcoal line art inspired by isometric field sketches.
- **Data-First Hierarchy:** A clean, systematic interface where white space represents the vast ice caps.
- **Tactile Line Work:** Icons and map elements that feel hand-drawn yet technically precise, providing a human connection to the raw data of nature.
- **Clarity over Ornamentation:** Avoiding gradients or heavy shadows in favor of structural integrity and clear informational paths.

## Colors

The palette is derived from the high-latitude environment, ensuring high contrast for readability and a "chilled" aesthetic.

- **Primary (Arctic Blue):** Used for active data points, movement vectors, and critical scientific findings.
- **Secondary (Glacier Tint):** A subtle, desaturated blue for background surfaces and secondary containers to reduce eye strain against pure white.
- **Tertiary (Charcoal Black):** Reserved for technical line art, borders, and primary typography, mimicking archival ink.
- **Neutral (Ice White):** The foundational canvas, providing maximum whitespace and a sense of openness.
- **Functional Accents:** Minimal use of a desaturated red for "Warning" or "Low Battery" alerts on tracking collars, ensuring these markers stand out without breaking the arctic theme.

## Typography

The typography strategy prioritizes systematic clarity. **Hanken Grotesk** is the primary typeface, offering a contemporary, sharp geometric feel that remains approachable. It is used for all narrative and structural headers.

**JetBrains Mono** is utilized for "Field Notes," coordinates, and technical metadata. This monospaced choice reinforces the scientific nature of the app and ensures that numerical tracking data (lat/long) remains perfectly aligned and legible.

**Usage Rules:**
- Titles use tight letter spacing for a compact, authoritative look.
- Data labels are always set in JetBrains Mono to distinguish objective data from descriptive text.
- Use uppercase sparingly for category labels to maintain a "calm" information architecture.

## Layout & Spacing

This design system employs a **Fluid Grid** with generous margins to mimic the vastness of the polar landscape.

- **Grid:** A 12-column grid on desktop and a 4-column grid on mobile. 
- **Rhythm:** An 8px linear scale is used for all internal component spacing to maintain a mathematical, engineered feel.
- **Safe Areas:** Significant "Ice Padding" (32px+) is encouraged around primary visual assets (like the bear icons or isometric maps) to prevent the UI from feeling cluttered.
- **Reflow:** On mobile, data cards stack vertically, while the isometric map retains a minimum 1:1 aspect ratio to ensure environmental context is never lost.

## Elevation & Depth

To maintain the "Scientific Blueprint" aesthetic, elevation is achieved through **Tonal Layering** and **Bold Outlines** rather than traditional shadows.

- **Base Layer:** Pure Ice White (#FFFFFF).
- **Surface Layer:** Glacier Tint (#EBF5FF) used for cards and sidebars to create a subtle lift.
- **Technical Borders:** 1px solid borders in Charcoal Black or a lightened Arctic Gray are used to define interactive areas.
- **Interactive Depth:** When a component is "pressed" or "active," it does not rise; instead, it utilizes a 2px offset border (Brutalist style) to indicate engagement, or a subtle stippled texture overlay (mimicking the hand-drawn reference) to show focus.

## Shapes

The shape language is primarily **Soft (0.25rem)**, reflecting the precision of scientific equipment while avoiding the harshness of a purely industrial tool.

- **Containers:** Use 4px corner radii for a "notched card" look.
- **Interactive Elements:** Buttons and input fields follow the same 4px rule.
- **Data Points:** Map markers for bears are circular to contrast against the angular isometric environment, ensuring they are immediately identifiable.
- **Illustrations:** Any hand-drawn isometric icons (trees, mountains, research huts) should maintain 1px line weights with slightly rounded terminations to match the ink-pen aesthetic of the reference images.

## Components

### Buttons
- **Primary:** Arctic Blue background with White text. No shadow, 1px charcoal border.
- **Secondary:** Transparent background with 1px Charcoal border.
- **Icon Buttons:** Circular with a 1px border, utilizing the minimalist line-art style.

### Data Cards
- Cards feature a 1px border and a small "label-caps" tag in the top left corner.
- Internal padding is generous (20px) to ensure data visualization (charts/graphs) has room to breathe.

### Isometric Map Markers
- Bear markers: A primary blue dot with a pulsing 10% opacity ring.
- Research Huts: Small isometric line-art buildings directly from the design narrative.
- Paths: Dotted 1px lines in Charcoal Black to show historical movement.

### Input Fields
- Underline style or fully enclosed with 1px border.
- Placeholder text in JetBrains Mono to signal technical entry.

### Chips & Tags
- Used for "Status" (e.g., *Hibernating*, *Migrating*). 
- Pill-shaped with light Glacier Tint backgrounds and Charcoal text.