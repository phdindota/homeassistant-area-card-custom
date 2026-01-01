# Pull Request: Add Mushroom-style Visual Mode to Area Overview Card

## 🍄 Overview

This PR adds an optional **Mushroom-style visual mode** to the Area Overview Card, bringing modern, polished aesthetics inspired by the popular [Mushroom cards](https://github.com/piitaya/lovelace-mushroom) to your area cards. When enabled with `mushroom_style: true`, cards adopt softer rounded corners, subtle borders, and theme-aware backgrounds while maintaining full backwards compatibility.

## 📸 Visual Comparison

![Mushroom Style Mode - Visual Comparison](https://github.com/user-attachments/assets/3fa3ca3d-b781-4af5-ac0e-d0b9221e888c)

The screenshot above shows the key differences between default and Mushroom-style modes:

- **Left:** Default card appearance with standard styling
- **Right:** Mushroom-style mode with enhanced visuals

## ✨ What's New

### New Configuration Option

```yaml
mushroom_style: true # Optional, defaults to false
```

### Visual Enhancements (When Enabled)

| Feature             | Default     | Mushroom Style                               | Change                |
| ------------------- | ----------- | -------------------------------------------- | --------------------- |
| **Border Radius**   | 12px        | 16px                                         | +4px (softer corners) |
| **Border**          | None        | 1px solid rgba(255,255,255,0.06)             | Subtle depth          |
| **Background**      | transparent | rgba(var(--rgb-card-background-color), 0.96) | Theme-aware           |
| **Sensor Icons**    | 18px        | 20px                                         | +2px                  |
| **Sensor Buttons**  | 32px        | 36px                                         | +4px                  |
| **Control Icons**   | 24px        | 22px                                         | -2px (consistency)    |
| **Control Buttons** | 48px        | 44px                                         | -4px                  |

## 🎯 Key Features

✅ **Opt-in only** - Defaults to `false`, no impact on existing cards
✅ **Fully backwards compatible** - All existing `style.*` options still work
✅ **Theme-aware** - Uses Home Assistant CSS variables for seamless integration
✅ **Override-friendly** - Explicit style values always take precedence
✅ **Visual editor support** - Toggle in General Settings section

## 📝 Usage Examples

### Basic Usage

```yaml
type: custom:area-overview-card
title: Living Room
area: living_room
mushroom_style: true
```

### With Custom Styling

```yaml
type: custom:area-overview-card
title: Kitchen
area: kitchen
mushroom_style: true
style:
  background_color: 'rgba(50, 50, 50, 0.9)' # Overrides Mushroom default
  sensors_icon_size: '24px' # Overrides Mushroom default
```

### Without Mushroom Style (Default)

```yaml
type: custom:area-overview-card
title: Bedroom
area: bedroom
# mushroom_style not set or false - renders exactly as before
```

## 🔧 Technical Implementation

### Files Modified

- **src/types.ts** - Added `mushroom_style?: boolean` to config interface
- **src/minimalistic-area-card.ts** - Core rendering logic and CSS styles
- **src/utils.ts** - CSS variable building with conditional Mushroom defaults
- **src/editor.ts** - Visual editor toggle
- **README.md** - User documentation
- **test/config.test.ts** - Configuration tests (3 new tests)
- **test/minimalistic-area-card.test.ts** - CSS class application tests (3 new tests)
- **dist/homeassistant-area-card-custom.js** - Built bundle

### New Tests

Added 6 comprehensive tests covering:

- ✅ Configuration flag recognition (true, false, undefined)
- ✅ CSS class application based on flag state
- ✅ Backwards compatibility verification

**Test Results:** 164 tests passing (up from 158)

### Security

✅ **CodeQL Security Scan:** 0 alerts found

### Code Quality

✅ All linting checks pass
✅ All code review feedback addressed:

- Renamed `mushroomStyle` → `isMushroomStyle` for clarity
- Extracted magic RGB values to named constant `MUSHROOM_DARK_THEME_FALLBACK`

## 🎨 Design Inspiration

This feature draws from Mushroom card design patterns:

- **Rounded corners** (~16px) for a modern, friendly appearance
- **Subtle borders** with low opacity for visual depth
- **Theme-aware backgrounds** using CSS variables like `--rgb-card-background-color`
- **Consistent icon sizing** for a polished, professional look
- **Home Assistant theme integration** for seamless dashboard cohesion

References:

- [Mushroom Cards Repository](https://github.com/piitaya/lovelace-mushroom)
- [Mushroom Themes](https://github.com/piitaya/lovelace-mushroom-themes)

## 🔒 Backwards Compatibility

**No Breaking Changes**

- ✅ Default behavior unchanged when `mushroom_style` not set or `false`
- ✅ All existing `style.*` options continue to work
- ✅ Explicit style values override Mushroom defaults
- ✅ Existing dashboards render exactly as before
- ✅ All 158 original tests still pass

## 📚 Documentation

### Updated Files

- **README.md** - Added configuration option and "Mushroom-style Look" section
- **MUSHROOM_STYLE_IMPLEMENTATION.md** - Comprehensive technical documentation

### Visual Editor

The visual editor now includes a toggle for "Mushroom-style visuals" in the General Settings section, making it easy to enable without YAML editing.

## 🧪 Testing Instructions

1. **Build the card:**

   ```bash
   yarn install
   yarn build
   ```

2. **Copy to Home Assistant:**

   ```bash
   cp dist/homeassistant-area-card-custom.js /path/to/homeassistant/www/
   ```

3. **Test default behavior:**

   ```yaml
   type: custom:area-overview-card
   title: Test Default
   area: living_room
   ```

   Should render exactly as current version (no visual changes)

4. **Test Mushroom style:**

   ```yaml
   type: custom:area-overview-card
   title: Test Mushroom
   area: living_room
   mushroom_style: true
   ```

   Should show enhanced visuals with rounded corners and subtle border

5. **Test with custom styles:**
   ```yaml
   type: custom:area-overview-card
   title: Test Custom + Mushroom
   area: living_room
   mushroom_style: true
   style:
     background_color: 'rgba(100, 50, 50, 0.9)'
   ```
   Custom background should override Mushroom default

## 📋 Checklist

- [x] Code follows project style guidelines
- [x] All tests pass (164/164)
- [x] New tests added for new functionality
- [x] Documentation updated (README + implementation guide)
- [x] Backwards compatibility maintained
- [x] Security scan clean (0 alerts)
- [x] Code review feedback addressed
- [x] Visual comparison provided
- [x] Built bundle included in PR

## 🚀 Next Steps

After merge:

1. Tag new release version
2. Update HACS repository listing
3. Consider creating example dashboard configurations
4. Gather community feedback on visual adjustments

## 📎 Related Issues

Addresses the request to improve Area Overview Card aesthetics by applying Mushroom-inspired design patterns while maintaining the card's existing functionality and configuration options.

---

**Ready for review!** 🎉

This PR is feature-complete, fully tested, documented, and backwards compatible. All existing users will see no changes unless they explicitly enable `mushroom_style: true`.
