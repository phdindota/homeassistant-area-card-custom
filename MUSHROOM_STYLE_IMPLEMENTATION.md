# Mushroom Style Mode - Implementation Summary

## Overview

This PR implements an optional "Mushroom-style" visual mode for the Area Overview Card, inspired by the popular [Mushroom cards](https://github.com/piitaya/lovelace-mushroom) design patterns. When enabled, the card adopts a more polished, modern appearance with rounded corners, subtle borders, and theme-aware styling.

## Implementation Details

### 1. Configuration Option

Added `mushroom_style?: boolean` to `MinimalisticAreaCardConfig` in `src/types.ts`:

```typescript
mushroom_style?: boolean;  // Apply Mushroom-inspired visuals
```

- **Default:** `false` (ensures backwards compatibility)
- **Usage:** Set to `true` to enable Mushroom-style visuals

### 2. Visual Changes When Enabled

#### Border and Shape
- **Border radius:** 12px → 16px (softer, more rounded corners)
- **Border:** Added 1px solid border with rgba(255, 255, 255, 0.06) opacity
- Applied to card container, images, and camera feeds

#### Background
- **Default style:** Transparent background
- **Mushroom style:** `rgba(var(--rgb-card-background-color, 18, 22, 28), 0.96)`
- Uses CSS variables to adapt to Home Assistant themes
- Fallback to dark theme colors (18, 22, 28) when CSS variable unavailable

#### Icon and Button Sizes
Enhanced to match Mushroom's visual language:

| Element | Default | Mushroom Style |
|---------|---------|----------------|
| Sensor Icons | 18px | 20px (+2px) |
| Sensor Buttons | 32px | 36px (+4px) |
| Control Icons | 24px | 22px (-2px) |
| Control Buttons | 48px | 44px (-4px) |

### 3. Code Changes

#### src/types.ts
- Added `mushroom_style?: boolean` to `MinimalisticAreaCardConfig` interface

#### src/minimalistic-area-card.ts
- Added CSS class application logic in `render()` method
- Conditionally adds `mushroom-style` class to host element
- Added CSS rules for `:host(.mushroom-style)` selector
- Passes `isMushroomStyle` flag to `buildCssVariables()`

#### src/utils.ts
- Updated `buildCssVariables()` to accept `isMushroomStyle` parameter
- Applies Mushroom-specific defaults when flag is true
- Uses named constant for fallback RGB values
- All explicit style values still override Mushroom defaults

#### src/editor.ts
- Added toggle switch in General Settings section
- Label: "Mushroom-style visuals"
- Uses existing `_toggleChanged` handler
- Integrates seamlessly with visual editor

### 4. Backwards Compatibility

✅ **Fully backwards compatible:**
- Default behavior unchanged when flag not set or `false`
- All existing `style.*` options continue to work
- Explicit style values override Mushroom defaults
- No breaking changes for existing users
- Existing dashboards render exactly as before

### 5. Testing

Added comprehensive tests in:
- `test/config.test.ts` - Configuration flag recognition
- `test/minimalistic-area-card.test.ts` - CSS class application

**Test coverage:**
- ✅ Flag recognition when `true`, `false`, or undefined
- ✅ CSS class added when enabled
- ✅ CSS class not added when disabled or undefined
- ✅ All existing tests still pass (164 total tests)

### 6. Documentation

#### README.md Updates
1. Added `mushroom_style` to configuration options table
2. Added dedicated "Mushroom-style Look (Optional)" section
3. Included usage examples and explanation of visual changes
4. Documented that existing style options still work

Example configuration:
```yaml
type: custom:area-overview-card
title: Bathroom
area: bathroom
mushroom_style: true
```

### 7. Security

✅ CodeQL security scan: **0 alerts found**

### 8. Design Inspiration

Based on Mushroom card design patterns:
- **Border radius:** Mushroom cards use ~12-16px for soft corners
- **Borders:** Subtle borders with low opacity for depth
- **Backgrounds:** Theme-aware using CSS variables like `--rgb-card-background-color`
- **Icon sizes:** Consistent sizing for a polished look
- **Theme integration:** Uses Home Assistant theme variables for seamless integration

### 9. How to Use

#### Basic usage:
```yaml
type: custom:area-overview-card
title: Living Room
area: living_room
mushroom_style: true
```

#### With custom styling:
```yaml
type: custom:area-overview-card
title: Kitchen
area: kitchen
mushroom_style: true
style:
  background_color: "rgba(50, 50, 50, 0.9)"  # Overrides Mushroom default
  sensors_icon_size: "24px"                  # Overrides Mushroom default
```

### 10. Visual Comparison

**Before (Default):**
- 12px border radius
- No border
- Transparent background
- Standard icon sizes

**After (Mushroom Style):**
- 16px border radius
- Subtle 1px border with low opacity
- Theme-aware background color
- Optimized icon sizes

### 11. Files Changed

- `src/types.ts` - Added configuration interface
- `src/minimalistic-area-card.ts` - Core rendering and styling
- `src/utils.ts` - CSS variable building logic
- `src/editor.ts` - Visual editor toggle
- `README.md` - Documentation
- `test/config.test.ts` - Configuration tests
- `test/minimalistic-area-card.test.ts` - Visual behavior tests
- `dist/homeassistant-area-card-custom.js` - Built bundle

### 12. Breaking Changes

**None.** This is a purely additive feature with opt-in behavior.

## Future Enhancements (Optional)

Potential future improvements could include:
- Additional Mushroom-inspired themes (different color schemes)
- More granular control over Mushroom-style elements
- Integration with Mushroom theme variables
- Animation transitions when toggling Mushroom mode

## References

- [Mushroom Cards Repository](https://github.com/piitaya/lovelace-mushroom)
- [Mushroom Themes](https://github.com/piitaya/lovelace-mushroom-themes)
- [Home Assistant Card Styling Guide](https://www.home-assistant.io/dashboards/styling/)
