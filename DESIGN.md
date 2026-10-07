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
  illustrated-water: "#d9f1f3"
  illustrated-water-night: "#123d49"
  illustration-ink: "#154d68"
  illustration-land-ink: "#386f51"
  illustration-night-ink: "#e4f3ee"
  map-marker-slate: "#505d6e"
  map-marker-slate-hover: "#354a5b"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "42px"
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
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "0.15em"
  explore-display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(40px, 3.25vw, 56px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  explore-map-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  explore-selector-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  explore-caption:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.636364
  sidebar-label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.25
  sidebar-label-active:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.25
  location-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  marker-number:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 700
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  shell: "16px"
  navigation: "12px"
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
    backgroundColor: "color-mix(in srgb, var(--teal-soft) 62%, var(--white))"
    textColor: "{colors.deep-current-teal}"
    typography: "{typography.sidebar-label-active}"
    rounded: "{rounded.navigation}"
    padding: "10px 14px"
    height: "48px"
  status-chip:
    backgroundColor: "{colors.review-surface}"
    textColor: "{colors.review-copy}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  map-marker-selected:
    backgroundColor: "{colors.deep-water-teal}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    typography: "{typography.marker-number}"
    height: "48px"
    width: "48px"
  map-marker-unselected:
    backgroundColor: "{colors.map-marker-slate}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    typography: "{typography.marker-number}"
    height: "48px"
    width: "48px"
  app-shell:
    backgroundColor: "transparent"
    rounded: "0px"
    width: "100%"
    height: "100dvh"
  app-sidebar:
    backgroundColor: "{colors.surface-white}"
    width: "184px"
    position: "sticky"
  explore-map-panel:
    backgroundColor: "{colors.surface-white}"
    rounded: "16px"
    typography: "{typography.explore-map-title}"
    padding: "18px"
  explore-location-panel:
    backgroundColor: "{colors.surface-white}"
    rounded: "16px"
    typography: "{typography.explore-selector-title}"
    padding: "22px"
  location-row:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "14px"
    typography: "{typography.location-title}"
    padding: "12px"
    height: "76px"
  location-row-selected:
    backgroundColor: "color-mix(in srgb, var(--teal-soft) 42%, var(--white))"
    textColor: "{colors.ink}"
    rounded: "14px"
    typography: "{typography.location-title}"
    padding: "12px"
    height: "76px"
  location-sheet:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "20px 20px 0 0"
    padding: "24px 20px max(24px, env(safe-area-inset-bottom))"
    width: "min(100%, 600px)"
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

### Illustration and Map Controls
- **Illustrated water / illustrated water night:** The map canvas under the generated artwork in light and dark themes.
- **Illustration ink / illustration land ink / illustration night ink:** Labels rendered over the artwork; the land-region label has its own green tone. Keep these colors scoped to the map.
- **Map-marker slate / map-marker slate hover:** Unselected numbered map controls and matching location circles. Selection uses the existing deep-water teal action fill with white numbers.

**The Review-Color Rule.** Keep amber for review or warning information and rose for errors; neither becomes a general brand accent.

## Typography

**Display Font:** Arial (with Helvetica and sans-serif fallbacks)  
**Body Font:** Arial (with Helvetica and sans-serif fallbacks)  
**Label/Mono Font:** No separate label or monospace family is used.

**Character:** A sturdy system sans keeps the interface familiar and readable. Heavy, tightly tracked headings provide the expressive contrast; body copy stays plain and open.

### Hierarchy
- **Display** (extra-bold, 56px, 1 line-height): The largest page heading at wide desktop sizes.
- **Headline** (extra-bold, 42px, 1 line-height): Responsive page headings below the largest breakpoint.
- **Title** (extra-bold, 24px, 1.333 line-height): Section headings and prominent card titles.
- **Body** (regular, 15px, 1.5 line-height): Explanatory text and standard reading copy.
- **Label** (bold, 12px, 0.15em letter-spacing, often uppercase): Short section overlines, category labels, and status context.

Explore has scoped display, map-title, selector-title and caption roles in the frontmatter. Its display uses bold rather than extra-bold Arial, and its caption keeps an 18px reading line. Sidebar labels, location names and marker numbers also have dedicated roles. A 15px root size makes the application type and rem-sized controls slightly more compact. Explore's display ranges from 40px to 56px on desktop, uses 42px on tablet, and 32px on mobile with a 1.1 line-height.

## Layout

Use a centered content area capped at 1440px on secondary pages. Explore fills the available content width. Page gutters are 20px on narrow screens, increase to 32px at the 640px breakpoint, and reach 48px at 1024px. Keep a 4px spacing base, with most component gaps and padding drawn from 12px, 16px, 20px, 24px, and 32px steps.

The catch-journal form and list use a wider split from 1280px upward.

### Map-first Explore reference

The Explore dashboard fills the viewport with no inset shell or outside frame. Its 184px labeled sidebar stays pinned while the content pane scrolls independently. A restrained wave accent sits along the bottom of the pale dashboard background. Smaller widths use a sticky header with a visible Menu button and a native navigation drawer; the page then scrolls as a single column.

At the desktop sidebar breakpoint, the illustrated map and location panel form a 1.87:1 grid with a 14px gap and a 320px minimum chooser width. Both panels align at the top and bottom. From 768px to 1199px, the chooser follows the map and its three options share a row. Below 768px, the chooser becomes a selected-location trigger that opens a native bottom-sheet dialog. The map is 300px tall on mobile and 420px on tablet; desktop preserves a larger illustration area.

Location rows use a 76px minimum height with 46px number markers. Controls retain practical click targets while text, cards and spacing use the more compact dashboard scale.

`public/assets/cavite-waters-map.png` is generated artwork reconstructed from the user-supplied reference. It is an illustration, not verified geography. Labels and interactive markers are rendered separately. Zoom enlarges the illustration; reset restores its overview and never requests GPS. Keep the illustration note outside the map controls and the truthful records-coverage notice below the workspace. Mobile places the illustration note beneath the map panel.

Use the existing Arial family, teal/ink palette, white surfaces and Lucide icons. Respect dark theme and reduced motion. Keep advisories and journal actions below the primary map workspace.

## Elevation & Depth

The visual system is mostly flat. White surfaces, a fine tidal-line border, and the difference between bay mist and white do most of the separation work. Shadows remain soft and sparse: cards use the subtle surface shadow, while the round map markers use a stronger shadow so they remain visible against the illustration. The map landforms use an inset shadow as part of the illustration only.

### Shadow Vocabulary
- **Surface separation** (0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)): A quiet edge beneath white cards and select controls.
- **Map-marker lift** (0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)): Keeps circular location markers legible above the illustrated water.

Explore uses a quieter panel shadow (0 8px 24px rgb(38 105 107 / 4%)), a compact marker shadow (0 5px 12px rgb(16 43 53 / 23%)) and a control shadow (0 3px 8px rgb(16 43 53 / 15%)). These are scoped additions to the flat field-guide surfaces.

**The Border-First Rule.** Use the border and surface contrast to define a resting card; reserve stronger shadow for small interactive markers.

## Shapes

Use soft, deliberate rounding rather than sharp corners. Small chips are fully pill-shaped; buttons, inputs, and navigation links use a 12px radius; selectable rows and secondary panels use 16px; major cards use 24px. Keep borders thin and light. Clip map art inside its rounded frame, while its coast shapes remain organic and irregular.

The full-screen Explore shell has no outside radius. Its map and location panels use 16px corners, sidebar links use 12px, and the bottom sheet rounds only its upper corners.

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
- **Style:** A labeled sidebar contains Explore, Species, My Catches, My Species and Settings. Language, theme and guide controls sit at the bottom, below a fine divider. Smaller widths expose the same navigation through a visible Menu button and a native drawer.
- **States:** The active link uses a mixed sea-glass/white fill, deep-current text and a 600 weight. Inactive links use the current muted-text token; hover introduces a lighter sea-glass mix. Keep route labels and Lucide icons together.
- **Treatment:** Keep language accessible through its native select, and retain accessible labels on icon-only theme, guide and close controls. Preserve the existing route and state behavior when changing layout.

### Map Selection Marker
- **Shape:** Circular numbered controls with a white 3px rim and compact lift. Mobile uses a 44px control and 17px number; wide desktop uses the marker size and type tokens.
- **Selected:** Deep-water teal action fill. The selected marker retains the same size as its peers.
- **Unselected:** Map-marker slate fill, darkening on hover; keep numbers white and bold. Map focus uses a dark ink outline so it stays distinct from the pale water.

### Explore Map Panel
- **Character:** The illustration is the dominant discovery surface, framed by a white rounded panel and a quiet heading row.
- **Controls:** Numbered buttons and the compact waterbody selector share the selected area. Reset restores the illustration overview; plus and minus change its visual scale without implying map navigation or GPS.
- **Caption:** Keep the small illustration note visible outside the control cluster. The separate coverage notice uses the existing review colors and reflects the selected water.
- **Dark theme:** Use the dedicated night canvas, reduced artwork brightness and pale map-label ink; keep selected controls teal with white numbers.

### Location Options and Sheet
- **Rows:** Native radio inputs sit beside a numbered circle, bold location name and muted subtitle. The selected row uses a teal border and a sea-glass/white mix; an unselected radio uses the live muted-text token for its two-pixel border.
- **Focus:** Place the visible focus outline around the full row. Preserve native radio semantics and the shared selected-area state across markers, dropdown, panel and sheet.
- **Sheet:** The mobile trigger opens a native modal dialog anchored at the bottom, with upper rounded corners, safe-area padding, a close control and a full-width Done action. Focus starts on the selected radio; the dialog's native keyboard behavior and return to its trigger remain intact.

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
