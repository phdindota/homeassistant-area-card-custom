# Visual Editor UI Description

This document describes the visual editor interface for the **Better Minimalistic Area Card** - a custom Lovelace card for Home Assistant dashboards.

## About This Card

The Better Minimalistic Area Card is a **custom card** that can be placed in any Home Assistant dashboard. It displays area information with sensors and controllable entities in a clean, minimalistic design. This is **not** a dashboard template or full dashboard replacement - it's a card component you add to your existing dashboards.

## Editor Layout

When a user opens the card editor in Home Assistant, they will see:

### Top Section: Editor Mode Toggle
```
┌─────────────────────────────────────────────┐
│  [Visual Editor] [YAML Editor]              │
└─────────────────────────────────────────────┘
```

### Expandable Sections (when Visual Editor is selected)

#### 1. General Settings (expandable panel)
```
┌─────────────────────────────────────────────┐
│ ⚙ General Settings                      [v] │
├─────────────────────────────────────────────┤
│ Title: [_________________]                  │
│ Image URL: [_________________]              │
│   (URL to background image)                 │
│ Area: [Kitchen ▼]                           │
│ Camera Entity: [camera.kitchen ▼]           │
│ Camera View: [Auto ▼]                       │
│ Icon: [🔍 mdi:home]                         │
│                                             │
│ ☑ Show Area Icon                           │
│ ☑ Shadow                                    │
│ ☑ Darken Image                              │
│ ☐ Hide Unavailable Entities                │
│ ☑ State Color                               │
└─────────────────────────────────────────────┘
```

#### 2. Style Settings (expandable panel with RGB Color Pickers)
```
┌─────────────────────────────────────────────┐
│ 🎨 Style                                 [v] │
├─────────────────────────────────────────────┤
│ Color (text and icons): [🎨 #FFFFFF]       │
│ Background Color:       [🎨 #000000]       │
│ Shadow Color:           [🎨 #808080]       │
│ Sensors Color:          [🎨 #A9A9A9]       │
│ Sensors Icon Size:      [18px_______]      │
│   (Default: 18px)                           │
│ Sensors Button Size:    [32px_______]      │
│   (Default: 32px)                           │
│ Buttons Color:          [🎨 #FFFFFF]       │
│ Buttons Icon Size:      [24px_______]      │
│   (Default: 24px)                           │
│ Buttons Button Size:    [48px_______]      │
│   (Default: 48px)                           │
└─────────────────────────────────────────────┘
```

When clicking on any color field (🎨), a color picker dialog appears:
```
┌─────────────────────┐
│  Color Picker       │
├─────────────────────┤
│      [Color Wheel]  │
│         ⚪          │
│       🌈  🟢        │
│                     │
│ R: [255] ⎯⎯⎯⎯⎯    │
│ G: [128] ⎯⎯⎯⎯⎯    │
│ B: [64 ] ⎯⎯⎯⎯⎯    │
│                     │
│ [Cancel]  [Select]  │
└─────────────────────┘
```

#### 3. Alignment Settings (expandable panel)
```
┌─────────────────────────────────────────────┐
│ ⚙ Alignment                              [v] │
├─────────────────────────────────────────────┤
│ Title Alignment:          [Left ▼]          │
│ Sensors Alignment:        [Left ▼]          │
│ Buttons Alignment:        [Right ▼]         │
│ Title Entities Alignment: [Right ▼]         │
└─────────────────────────────────────────────┘
```

#### 4. Actions Settings (expandable panel)
```
┌─────────────────────────────────────────────┐
│ 👆 Actions                               [v] │
├─────────────────────────────────────────────┤
│ Tap Action:    [Navigate ▼]                │
│   Navigation Path: /lovelace/kitchen        │
│                                             │
│ Hold Action:   [More Info ▼]               │
│                                             │
│ Double Tap Action: [None ▼]                │
└─────────────────────────────────────────────┘
```

#### 5. Entities Settings (expandable panel)
```
┌─────────────────────────────────────────────┐
│ 📦 Entities                              [v] │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Entity: [light.kitchen ▼]        [🗑]  │ │
│ ├─────────────────────────────────────────┤ │
│ │ ☑ Show State     ☐ Hide                │ │
│ │ Section:  [Auto ▼]                     │ │
│ │ Color:    [🎨 #FFD700]                 │ │
│ │ Icon:     [🔍 mdi:lightbulb]           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Entity: [switch.coffee ▼]        [🗑]  │ │
│ ├─────────────────────────────────────────┤ │
│ │ ☑ Show State     ☐ Hide                │ │
│ │ Section:  [Buttons ▼]                  │ │
│ │ Color:    [🎨 Not Set]                 │ │
│ │ Icon:     [🔍 Not Set]                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [➕ Add Entity]                             │
└─────────────────────────────────────────────┘
```

## Key Visual Features

### Color Picker Integration
- Each color field shows a small color swatch preview
- Clicking opens Home Assistant's native RGB color picker
- Color picker shows:
  - Interactive color wheel
  - RGB sliders
  - Live preview of selected color
  - Support for millions of colors

### Responsive Design
- All sections collapse/expand for better space management
- Form fields are full-width for easy input
- Helper text appears below fields when needed
- Error states shown inline with fields

### Entity Management
- Each entity gets its own card within the list
- Delete button (🗑) on each entity
- Entity details expand when an entity is selected
- Add button at bottom to add new entities

### Toggle Switch (Top)
When switching to YAML editor, the view changes to:
```
┌─────────────────────────────────────────────┐
│  [Visual Editor] [YAML Editor]              │
└─────────────────────────────────────────────┘

For instructions, visit the Better Minimalistic Area
Card documentation on GitHub.

┌─────────────────────────────────────────────┐
│ type: custom:better-minimalistic-area-card  │
│ title: Kitchen                              │
│ area: kitchen                               │
│ style:                                      │
│   color:                                    │
│     r: 255                                  │
│     g: 255                                  │
│     b: 255                                  │
│   background_color: '#000000'               │
│ entities:                                   │
│   - entity: light.kitchen                   │
│     color:                                  │
│       r: 255                                │
│       g: 215                                │
│       b: 0                                  │
└─────────────────────────────────────────────┘
```

## User Experience Flow

1. User opens card editor → Visual Editor shown by default
2. User sees organized sections, all collapsed initially
3. User expands "Style" section
4. User clicks on "Color (text and icons)" color field
5. Color picker modal opens with color wheel
6. User selects desired color by clicking on wheel or adjusting RGB sliders
7. Color updates immediately in the preview
8. User clicks "Select" to apply
9. Color value updates in config (stored as RGB object)
10. User can switch to YAML to see the RGB values if needed
11. When card renders, RGB values are converted to CSS colors

## Advantages Over YAML-Only Editor

### Before (YAML only):
- User must know exact property names
- Must understand YAML syntax
- Color values need to be typed as hex codes or color names
- No validation or help text
- Easy to make syntax errors
- No visual feedback

### After (Visual Editor):
- Point-and-click interface
- Organized sections with clear labels
- Visual color picker for all colors
- Dropdowns with valid options only
- Helper text for guidance
- Immediate validation
- YAML still available if needed

## Accessibility Features

- Proper ARIA labels on all form fields
- Keyboard navigation support
- Form fields have clear labels
- Helper text for complex fields
- Expansion panels clearly indicate expanded/collapsed state
- Color contrast meets accessibility standards
