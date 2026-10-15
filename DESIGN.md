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
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
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
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  explore-map-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  explore-selector-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  explore-caption:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.636364
  sidebar-label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.25
  sidebar-label-active:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25
  location-title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  marker-number:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    fontWeight: 700
rounded:
  sm: "8px"
  md: "8px"
  lg: "12px"
  xl: "14px"
  shell: "16px"
  navigation: "8px"
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
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.deep-water-teal}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  input-field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "16px"
  nav-active:
    backgroundColor: "color-mix(in srgb, var(--teal-soft) 62%, var(--white))"
    textColor: "{colors.deep-current-teal}"
    typography: "{typography.sidebar-label-active}"
    rounded: "{rounded.navigation}"
    padding: "8px 10px"
    height: "40px"
  status-chip:
    backgroundColor: "{colors.review-surface}"
    textColor: "{colors.review-copy}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    height: "28px"
  map-marker-selected:
    backgroundColor: "{colors.deep-water-teal}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    typography: "{typography.marker-number}"
    height: "44px"
    width: "44px"
  map-marker-unselected:
    backgroundColor: "{colors.map-marker-slate}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    typography: "{typography.marker-number}"
    height: "44px"
    width: "44px"
  app-shell:
    backgroundColor: "transparent"
    rounded: "0px"
    width: "100%"
    height: "100dvh"
  app-sidebar:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.shell}"
    padding: "12px 10px"
    width: "212px"
  explore-map-panel:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    typography: "{typography.explore-map-title}"
    padding: "16px"
  explore-location-panel:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    typography: "{typography.explore-selector-title}"
    padding: "16px"
  location-row:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    typography: "{typography.location-title}"
    padding: "10px"
    height: "60px"
  location-row-selected:
    backgroundColor: "color-mix(in srgb, var(--teal-soft) 42%, var(--white))"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    typography: "{typography.location-title}"
    padding: "10px"
    height: "60px"
  location-sheet:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "14px 14px 0 0"
    padding: "20px 16px max(20px, env(safe-area-inset-bottom))"
    width: "min(100%, 560px)"
---

# Design System: Bangwit

## Overview

**Creative North Star: "Cavite Waters Field Guide"**

The interface should feel like a clear, well-kept field guide: steady, local, and easy to scan. A pale bay-mist canvas, dark ink typography, and deep teal accents make the page feel calm without losing the confidence needed for clear actions and selected states.

Keep the map illustration and area selector visually legible and purposeful. Use compact, letter-spaced overlines to orient the reader, then let moderately weighted headings and quiet supporting copy establish hierarchy. Bilog appears as a small, warm illustration in the current prototype; keep that artwork supportive rather than making it the interface's main visual language.

**Key Characteristics:**
- Field-guide clarity with a calm, coastal palette.
- Compact controls and reusable surfaces leave the map room to lead.
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

**Character:** A sturdy system sans keeps the interface familiar and readable. Compact, moderately weighted headings establish hierarchy; body copy stays plain and open.

### Hierarchy
- **Display** (bold, 28px, 1.2 line-height): The shared page heading; mobile pages use 26px.
- **Headline** (bold, 26–28px, 1.2 line-height): Responsive Explore and journal page headings.
- **Title** (bold, 18px, 1.35 line-height): Section headings and prominent card titles.
- **Body** (regular, 14px, 1.5 line-height): Explanatory text and standard reading copy.
- **Label** (bold, 12px, 0.15em letter-spacing, often uppercase): Short section overlines, category labels, and status context.

Explore has scoped display, map-title, selector-title and caption roles in the frontmatter. The page title is 28px on desktop and 26px on mobile; map and selector headings are 18px on desktop and 17px on mobile. Sidebar labels, location names and marker numbers have dedicated compact roles. The 14px body baseline is supported by explicit 12px caption and 13px control tokens.

## Layout

Use a centered content area capped at 1440px on secondary pages. Explore fills the available content width. Shared page gutters are 24px and tighten to 16px below 768px; Explore and the catchbook use their own 20px desktop gutters. Keep a 4px spacing base, with common component gaps and padding drawn from 8px, 12px, 16px, 20px, and 24px steps.

The catch journal fills the page content area. “Log a catch” opens a right-hand native dialog drawer while keeping the journal behind it; below 600px, the drawer fills the screen. Policy pages cap at 768px; the offline page caps at 576px.

### Map-first Explore reference

The app shell reserves a sidebar column and floats its white, bordered panel 14px from the viewport edges. The expanded sidebar is 212px wide and the icon-only state is 64px; desktop content scrolls independently. Below 768px, a compact sticky header opens the same navigation in a native modal drawer and the page scrolls as one column.

At 1200px and wider, the illustrated map and location panel form a 1.87:1 grid with a 16px gap and a 280px minimum chooser width. From 768px to 1199px, the chooser follows the map and its three options share a row. Below 768px, the chooser becomes a selected-location trigger that opens a native bottom-sheet dialog. The map is 300px tall on mobile and 420px on tablet; desktop preserves at least 360px of illustration height.

Location rows use a 60px minimum height with 24px number badges. Map markers and map controls keep 44px interaction targets. Text, cards and spacing use the shared compact scale.

`public/assets/cavite-waters-map.png` is generated artwork reconstructed from the user-supplied reference. It is an illustration, not verified geography. Labels and interactive markers are rendered separately. Zoom enlarges the illustration; reset restores its overview and never requests GPS. Keep the illustration note outside the map controls and the truthful records-coverage notice below the workspace. Mobile places the illustration note beneath the map panel.

Use the existing Arial family, teal/ink palette, white surfaces and Lucide icons. Respect dark theme and reduced motion. Keep advisories and journal actions below the primary map workspace.

## Elevation & Depth

The visual system is mostly flat. White surfaces, a fine tidal-line border, and the difference between bay mist and white do most of the separation work. Shadows remain soft and sparse: the floating sidebar and popovers use diffuse shadows, while map markers use stronger lift against the illustration. Cards stay flat at rest. The map landforms use inset shading as part of the illustration only.

### Shadow Vocabulary
- **Floating shell** (`0 4px 18px rgb(16 43 53 / 6%)`): A light shadow beneath the independent sidebar panel.
- **Popover** (`0 8px 24px rgb(16 43 53 / 12%)`): Separates dropdown surfaces from nearby content.
- **Map-marker lift** (`0 5px 12px rgb(16 43 53 / 23%)`): Keeps circular location markers legible above the illustrated water.
- **Map-control lift** (`0 2px 6px rgb(16 43 53 / 15%)`): Keeps reset and zoom controls clear over the illustration.

The floating sidebar uses a soft 0 4px 18px shadow, popovers use 0 8px 24px, and map markers use 0 5px 12px. Cards remain flat at rest; the map's landform inset shading belongs to its illustration.

**The Border-First Rule.** Use the border and surface contrast to define a resting card; reserve shadows for floating navigation, popovers and map controls.

## Shapes

Use soft, deliberate rounding rather than sharp corners. Small chips are fully pill-shaped; buttons, inputs, dropdowns and navigation links use an 8px radius; cards use 12px; dialogs use 14px; the floating sidebar uses 16px. Keep borders thin and light. Clip map art inside its rounded frame, while its coast shapes remain organic and irregular.

The app shell fills the viewport while the sidebar floats inside its grid column. Map and location panels use 12px corners, and the location sheet rounds only its upper corners.

Keyboard focus uses a 3px aqua outline with a 3px offset. Honor reduced-motion preferences: transitions and animation should become effectively immediate when the system requests reduced motion.

## Components

### Buttons
- **Character:** Clear and steady, with restrained friendly details.
- **Shape:** Softly rounded corners (8px).
- **Primary:** Deep-water teal fill, white semibold text, 36px visual height and 12px horizontal padding; coarse-pointer controls rise to 44px.
- **Secondary:** White fill with a teal border and teal bold text; the hover surface changes to sea-glass.
- **Hover / Focus:** Darken the primary action on hover. Keep keyboard focus visibly outlined in aqua.

### Chips
- **Style:** Compact capsule with a pale amber surface and dark amber text for pending or review status.
- **State:** Use sea-glass with dark teal for selected location or navigation states.

### Cards / Containers
- **Corner Style:** Cards use 12px corners; nested surfaces follow the 8px control radius.
- **Background:** White on the bay-mist page canvas.
- **Shadow Strategy:** A fine border leads; cards stay flat at rest.
- **Border:** One-pixel tidal-line outline.
- **Internal Padding:** 16px, with tighter 12px padding for small-screen catch-gallery surfaces.

### Inputs / Fields
- **Style:** White field, one-pixel tidal-line border, 8px corners and 12px horizontal padding; controls are 36px tall on fine pointers and at least 44px on coarse pointers.
- **Focus:** Shift the border toward teal and retain a visible keyboard focus treatment.
- **Error:** Use the rose surface, border, and ink colors together so the state stays clear without relying on color alone.

### Shared UI Rule for New Screens
- Use `.ui-card`, `.ui-button`, and `.ui-input` from `src/app/globals.css` for new surfaces and controls. These classes inherit the shared spacing, color, radius, focus, and coarse-pointer tokens.
- Use `DropdownSelect` from `src/components/dropdown-select.tsx` for choice menus, and `CatchDatePicker` from `src/components/catch-date-picker.tsx` for date and calendar controls. Do not add native selects or separate date-picker markup for new UI.
- When a screen needs a new size or behavior, add a named variant to the shared component and its token-based styles. Avoid recreating the base card, dropdown, calendar, or field styles in a page stylesheet.
- This rule keeps new cards, dropdowns, and calendars aligned automatically through the shared primitives and global tokens.

### Navigation
- **Style:** A labeled sidebar contains Explore, Species, My Catches, My Species and Settings. Language, theme and guide controls sit at the bottom, below a fine divider. Smaller widths expose the same navigation through a visible Menu button and a native drawer.
- **States:** Desktop navigation expands to 212px or collapses to a 64px icon rail; the first desktop visit starts expanded, and the choice persists. Navigation rows are 40px, with 18px Lucide icons and 13px labels. The active link uses a mixed sea-glass/white fill, deep-current text and a 600 weight. Inactive links use muted ink; hover introduces a lighter sea-glass mix. Tablet defaults to the icon rail; below 768px the same routes live in a floating native dialog drawer.
- **Treatment:** Keep language accessible through its native select, and retain accessible labels on icon-only theme, guide and close controls. Preserve the existing route and state behavior when changing layout.

### Map Selection Marker
- **Shape:** Circular numbered controls with a white 3px rim and compact lift. All breakpoints use a 44px control with a bold 17px number.
- **Selected:** Deep-water teal action fill. The selected marker retains the same size as its peers.
- **Unselected:** Map-marker slate fill, darkening on hover; keep numbers white and bold. Map focus uses a dark ink outline so it stays distinct from the pale water.

### Explore Map Panel
- **Character:** The illustration is the dominant discovery surface, framed by a white rounded panel and a quiet heading row.
- **Controls:** Numbered buttons and the compact waterbody selector share the selected area. Reset restores the illustration overview; plus and minus change its visual scale without implying map navigation or GPS.
- **Caption:** Keep the small illustration note visible outside the control cluster. The separate coverage notice uses the existing review colors and reflects the selected water.
- **Dark theme:** Use the dedicated night canvas, reduced artwork brightness and pale map-label ink; keep selected controls teal with white numbers.

### Location Options and Sheet
- **Rows:** Native radio inputs sit beside a compact numbered badge, bold location name and muted subtitle. Rows are 60px high; selection uses a teal border and sea-glass/white mix.
- **Focus:** Place the visible focus outline around the full row. Preserve native radio semantics and the shared selected-area state across markers, dropdown, panel and sheet.
- **Sheet:** The mobile trigger opens a native modal dialog anchored at the bottom, with 14px upper corners, safe-area padding, a close control and a full-width Done action. Focus starts on the selected radio; the dialog's native keyboard behavior and return to its trigger remain intact.

## Do's and Don'ts

### Do:
- **Do** keep the map, place choices, and their selected state easy to distinguish at a glance.
- **Do** use deep teal for actions and selection, and keep headings anchored in ink.
- **Do** pair warning and error colors with direct labels or supporting text.
- **Do** preserve the light border, flat resting cards, sparse floating shadows, and rounded controls.
- **Do** keep the 3px keyboard-focus treatment visible and honor reduced motion.

### Don't:
- **Don't** add faux-nautical decoration such as ropes, anchors, weathered paper, or generic fishing clip art.
- **Don't** use amber as a general accent or let status color replace a readable label.
- **Don't** spread shadows across every surface; reserve them for floating navigation, popovers and map controls.
- **Don't** use the map's illustrated gradients and organic land shapes as a general page background treatment.
