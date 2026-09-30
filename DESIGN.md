---
name: Bangwit
description: A calm field guide to Cavite waters, shaped around clear maps and personal catch stories.
colors:
  deep-water-teal: "#087f78"
  deep-current-teal: "#05615d"
  sea-glass: "#e1f3f0"
  ink: "#102b35"
  muted-ink: "#667c84"
  tidal-line: "#dbe6e6"
  bay-mist: "#f5f8f7"
  surface-white: "#ffffff"
  focus-aqua: "#56b9b0"
  review-surface: "#fffbeb"
  review-copy: "#78350f"
  review-ink: "#451a03"
  error-surface: "#fff1f2"
  error-line: "#fecdd3"
  error-ink: "#881337"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "60px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.333
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "0.15em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  4xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.deep-water-teal}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.deep-water-teal}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  card:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.xl}"
    padding: "20px"
  nav-active:
    backgroundColor: "{colors.sea-glass}"
    textColor: "{colors.deep-current-teal}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  status-chip:
    backgroundColor: "{colors.review-surface}"
    textColor: "{colors.review-copy}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  map-marker-selected:
    backgroundColor: "{colors.deep-water-teal}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    height: "44px"
    width: "44px"
---

# Design System: Bangwit

## Overview

**Creative North Star: "Cavite Waters Field Guide"**

The interface should feel like a clear, well-kept field guide: steady, local, and easy to scan. A pale bay-mist canvas, dark ink typography, and deep teal accents make the page feel calm without losing the confidence needed for clear actions and selected states.

Keep the map illustration and area selector visually legible and purposeful. Use compact, letter-spaced overlines to orient the reader, then let large, tightly tracked headings and quiet supporting copy establish hierarchy. Bilog appears as a small, warm illustration in the current prototype; keep that artwork supportive rather than making it the interface's main visual language.

**Key Characteristics:**
- Field-guide clarity with a calm, coastal palette.
- Strong ink-and-teal hierarchy with generous breathing room.
- Friendly rounded controls and cards, kept visually restrained.

## Colors

The palette pairs deep-water teal with bay-mist surfaces and cool, dark ink. Teal carries links, actions, active navigation, and selected map markers; lighter sea-glass tints support selected states and quiet emphasis. Amber is reserved for review or warning states, while rose is reserved for errors.

### Primary
- **Deep-water teal:** The main action and selection color; use it for primary buttons, links, selected locations, and small section labels.
- **Deep-current teal:** The darker companion for pressed or hover states and high-contrast active navigation.
- **Sea-glass:** A pale teal wash for selected navigation, selected rows, and low-emphasis icon surfaces.

### Neutral
- **Ink:** The main heading and body-text color; it gives the light interface a clear anchor.
- **Muted ink:** Supporting descriptions, secondary labels, and quiet metadata.
- **Bay mist:** The page canvas, which separates white cards without adding a heavy frame.
- **Surface white:** Cards, fields, and raised content surfaces.
- **Tidal line:** The thin border and divider color used to define card and control edges.
- **Focus aqua:** The visible keyboard-focus outline color.

**The Review-Color Rule.** Keep amber for review or warning information and rose for errors; neither becomes a general brand accent.

## Typography

**Display Font:** Arial (with Helvetica and sans-serif fallbacks)  
**Body Font:** Arial (with Helvetica and sans-serif fallbacks)  
**Label/Mono Font:** No separate label or monospace family is used.

**Character:** A sturdy system sans keeps the interface familiar and readable. Heavy, tightly tracked headings provide the expressive contrast; body copy stays plain and open.

### Hierarchy
- **Display** (extra-bold, 60px, 1 line-height): The largest page heading at wide desktop sizes.
- **Headline** (extra-bold, 48px, 1 line-height): Responsive page headings below the largest breakpoint.
- **Title** (extra-bold, 24px, 1.333 line-height): Section headings and prominent card titles.
- **Body** (regular, 16px, 1.5 line-height): Explanatory text and standard reading copy.
- **Label** (bold, 12px, 0.15em letter-spacing, often uppercase): Short section overlines, category labels, and status context.

## Layout

Use a centered content area capped at 1440px. Page gutters are 20px on narrow screens, increase to 32px at the 640px breakpoint, and reach 48px at 1024px. Keep a 4px spacing base, with most component gaps and padding drawn from 12px, 16px, 20px, 24px, and 32px steps.

The home surface uses a flexible, asymmetric map-and-choice composition: it stacks on narrow screens, then places the map beside the selection panel from 1024px upward. The map column receives more width; the chooser keeps at least 320px. The catch-journal form and list use a wider split from 1280px upward. The header wraps its navigation below the brand on small screens and keeps the navigation in one row on wide screens.

## Elevation & Depth

The visual system is mostly flat. White surfaces, a fine tidal-line border, and the difference between bay mist and white do most of the separation work. Shadows remain soft and sparse: cards use the subtle surface shadow, while the round map markers use a stronger shadow so they remain visible against the illustration. The map landforms use an inset shadow as part of the illustration only.

### Shadow Vocabulary
- **Surface separation** (0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)): A quiet edge beneath white cards and select controls.
- **Map-marker lift** (0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)): Keeps circular location markers legible above the illustrated water.

**The Border-First Rule.** Use the border and surface contrast to define a resting card; reserve stronger shadow for small interactive markers.

## Shapes

Use soft, deliberate rounding rather than sharp corners. Small chips are fully pill-shaped; buttons, inputs, and navigation links use a 12px radius; selectable rows and secondary panels use 16px; major cards use 24px. Keep borders thin and light. Clip map art inside its rounded frame, while its coast shapes remain organic and irregular.

Keyboard focus uses a 3px aqua outline with a 3px offset. Honor reduced-motion preferences: transitions and animation should become effectively immediate when the system requests reduced motion.

## Components

### Buttons
- **Character:** Clear and steady, with restrained friendly details.
- **Shape:** Softly rounded corners (12px).
- **Primary:** Deep-water teal fill, white bold text, centered in a touch-friendly 48px minimum height with 20px horizontal padding.
- **Secondary:** White fill with a teal border and teal bold text; the hover surface changes to sea-glass.
- **Hover / Focus:** Darken the primary action on hover. Keep keyboard focus visibly outlined in aqua.

### Chips
- **Style:** Compact capsule with a pale amber surface and dark amber text for pending or review status.
- **State:** Use sea-glass with dark teal for selected location or navigation states.

### Cards / Containers
- **Corner Style:** Large cards use 24px corners; smaller nested surfaces use 16px.
- **Background:** White on the bay-mist page canvas.
- **Shadow Strategy:** A fine border leads; a soft shadow adds separation.
- **Border:** One-pixel tidal-line outline.
- **Internal Padding:** 20px on compact layouts, increasing to 24px at wider sizes.

### Inputs / Fields
- **Style:** White field, one-pixel tidal-line border, 12px corners, and 16px horizontal padding; controls are at least 48px tall.
- **Focus:** Shift the border toward teal and retain a visible keyboard focus treatment.
- **Error:** Use the rose surface, border, and ink colors together so the state stays clear without relying on color alone.

### Navigation
- **Style:** Sticky white header with a fine lower border. The brand stays left; navigation links align right on wide screens and scroll horizontally beneath the brand on narrow screens.
- **States:** The active link uses a sea-glass fill and deep-current text. Inactive links stay quiet until hover.
- **Treatment:** Keep the help control compact and outlined.

### Map Selection Marker
- **Shape:** 44px circular control with a white 3px rim and a soft lift.
- **Selected:** Deep-water teal fill, a slightly enlarged scale, and a subtle teal ring.
- **Unselected:** Muted slate fill; keep the marker number white and bold.

## Do's and Don'ts

### Do:
- **Do** keep the map, place choices, and their selected state easy to distinguish at a glance.
- **Do** use deep teal for actions and selection, and keep headings anchored in ink.
- **Do** pair warning and error colors with direct labels or supporting text.
- **Do** preserve the light border, soft shadow, and rounded-card balance.
- **Do** keep the 3px keyboard-focus treatment visible and honor reduced motion.

### Don't:
- **Don't** add faux-nautical decoration such as ropes, anchors, weathered paper, or generic fishing clip art.
- **Don't** use amber as a general accent or let status color replace a readable label.
- **Don't** spread shadows across every surface; use them for quiet separation and map-marker lift.
- **Don't** use the map's illustrated gradients and organic land shapes as a general page background treatment.
