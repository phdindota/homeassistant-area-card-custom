# Visual GUI Editor - Implementation Summary

## Overview

This document describes the implementation of a comprehensive visual GUI editor for the **Better Minimalistic Area Card** - a Home Assistant Lovelace custom card (frontend-only, no backend integration).

### What This Project Is

- **A Lovelace custom card** that displays area information with sensors and controllable entities
- **Frontend-only implementation** - no backend integration, no server-side component
- **Distributed via HACS** as a plugin (custom card category)
- **Built bundle** located in `dist/better-minimalistic-area-card.js`

### What This Project Is Not

- ❌ Not a full dashboard template
- ❌ Not a Home Assistant integration (no custom component)
- ❌ Not a theme
- ❌ Not a standalone dashboard

### Architecture

```
Source Code (src/)
    ↓ (TypeScript compilation & bundling via Rollup)
Built Bundle (dist/better-minimalistic-area-card.js)
    ↓ (Distributed via HACS using hacs.json configuration)
Installed in Home Assistant
    ↓ (Loaded as Lovelace resource)
Available as custom card in dashboards
```

The card is registered as `custom:better-minimalistic-area-card` and can be added to any Lovelace dashboard.

## Visual Editor Implementation

The visual editor replaces the YAML-only configuration interface with a user-friendly form-based editor while maintaining full backward compatibility.

## Key Features Implemented

### 1. Visual Editor with Organized Sections

The editor is organized into five expandable sections for better usability:

#### **General Settings**
- Title input field
- Image URL input (with helper text)
- Area dropdown (auto-populated from Home Assistant areas)
- Camera entity picker (filtered to camera entities only)
- Camera view selector (auto/live)
- Icon picker using Home Assistant's icon selector
- Toggle switches for:
  - Show Area Icon
  - Shadow
  - Darken Image
  - Hide Unavailable Entities
  - State Color

#### **Style Settings**
All style options now feature RGB color pickers:
- Color (main text and icon color) - RGB picker
- Background Color - RGB picker
- Shadow Color - RGB picker
- Sensors Color - RGB picker
- Sensors Icon Size - Text input (default: 18px)
- Sensors Button Size - Text input (default: 32px)
- Buttons Color - RGB picker
- Buttons Icon Size - Text input (default: 24px)
- Buttons Button Size - Text input (default: 48px)

#### **Alignment Settings**
Dropdown selectors for:
- Title Alignment (left/center/right)
- Sensors Alignment (left/center/right)
- Buttons Alignment (left/center/right)
- Title Entities Alignment (left/right)

#### **Actions Settings**
Action selectors for:
- Tap Action
- Hold Action
- Double Tap Action

#### **Entities Settings**
Full entity list management:
- Add/Remove entity buttons
- For each entity:
  - Entity picker
  - Show State toggle
  - Hide toggle
  - Section dropdown (auto/sensors/buttons/title)
  - Color picker (RGB)
  - Icon picker

### 2. RGB Color Picker Integration

The implementation uses Home Assistant's native `color_rgb` selector which provides:
- Visual color wheel for intuitive color selection
- Support for millions of colors
- RGB value display
- Consistent UI with Home Assistant

### 3. Editor Mode Toggle

- Button toggle to switch between Visual Editor and YAML Editor
- Visual editor is the default for better user experience
- YAML editor remains accessible for advanced users and complex configurations
- Both editors sync with the configuration state

### 4. Backward Compatibility

The implementation maintains full backward compatibility:
- Existing YAML configurations work without modification
- String-based colors (hex, rgb, rgba, named colors) continue to work
- New RGB object format (`{r: number, g: number, b: number}`) is also supported
- Automatic conversion between formats as needed

## Technical Implementation Details

### Type System Updates

**ColorValue Type:**
```typescript
export type ColorValue = string | { r: number; g: number; b: number };
```

All color properties in `StyleOptions`, `ExtendedEntityConfig`, and `EntityStateConfig` now use `ColorValue` instead of `string`.

### Color Conversion Utilities

Two new utility functions handle color format conversions:

**colorValueToCSS()**
- Converts RGB objects or strings to CSS color strings
- Used when applying styles to the card
- Handles both input formats transparently

**cssToRGB()**
- Converts CSS color strings to RGB objects
- Supports hex (#RGB, #RRGGBB), rgb(), and rgba() formats
- Used when loading existing configurations into the color picker

### Security Enhancements

The `_updateConfigValue` function includes comprehensive protection against prototype pollution:
- Guards against dangerous property names (`__proto__`, `constructor`, `prototype`)
- Uses safe property access with `Object.prototype.hasOwnProperty.call()`
- Validates all property paths before assignment
- Creates safe objects during nested path creation

### Test Coverage

Added comprehensive test suite for color conversion utilities:
- RGB to CSS conversion tests
- CSS to RGB conversion tests (hex, rgb, rgba formats)
- Round-trip conversion tests
- Error handling for invalid inputs
- All 13 tests pass

## Usage Instructions

### For End Users

1. **Open the card editor** in Home Assistant's dashboard edit mode
2. **Visual Editor is the default** - you'll see organized sections with form fields
3. **Use color pickers** for all color settings - click on a color field to open the color wheel
4. **Switch to YAML mode** if needed using the toggle at the top
5. **Add/remove entities** using the buttons in the Entities section
6. **All changes auto-save** when you close the editor

### For Developers

The editor is implemented in `src/editor.ts`:
- Uses Lit Element for reactive rendering
- Leverages Home Assistant's built-in form components
- Handles config updates through `_updateConfigValue`
- Maintains state through `@state` decorator
- Properly fires `config-changed` events for Home Assistant integration

## Benefits

1. **Improved User Experience**: Visual form is much easier to use than YAML
2. **Reduced Errors**: Form validation prevents many common configuration mistakes
3. **Faster Configuration**: Color pickers and dropdowns are quicker than typing YAML
4. **Better Discovery**: Users can see all available options organized in sections
5. **Professional Look**: Matches Home Assistant's native card editors
6. **Maintains Flexibility**: YAML editor still available for advanced use cases

## Future Enhancements (Optional)

Potential future improvements:
- Preview pane showing live card preview
- Configuration templates/presets
- Import/export configuration
- Advanced entity configuration (state-based colors, custom templates)
- Drag-and-drop entity reordering
