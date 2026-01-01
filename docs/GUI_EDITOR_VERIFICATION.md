# GUI Editor Verification Report

## Executive Summary

The Area Overview Card's GUI editor **correctly handles nested style configuration paths**. All color and style options set via the visual editor are properly saved to the card configuration under the nested `style` object and persist between editor modes.

## Verification Results ✅

### Build & Quality Checks

- ✅ **Build**: All build steps pass (`npm install`, `npm run build`)
- ✅ **Tests**: All 189 tests pass (164 original + 25 new integration tests)
- ✅ **Linting**: Prettier and ESLint pass
- ✅ **Bundle**: Correctly generated at `dist/homeassistant-area-card-custom.js`
- ✅ **HACS**: Configuration correct in `hacs.json`
- ✅ **Security**: 0 CodeQL alerts

### GUI Editor Functionality

- ✅ **Nested Paths**: `style.color`, `style.background_color`, etc. work correctly
- ✅ **Config Persistence**: Changes persist when switching between visual/YAML editors
- ✅ **Event Handling**: `config-changed` events fire correctly
- ✅ **Backwards Compatibility**: Deprecated `background_color` still works
- ✅ **Security**: Prototype pollution prevention implemented

## How to Use the GUI Editor

### Accessing Style Options

1. Open Home Assistant dashboard in edit mode
2. Click on an Area Overview Card or add a new one
3. In the card editor, click "Show Visual Editor" (if in YAML mode)
4. Expand the "Style" section (palette icon)

### Available Style Options

| GUI Field              | Config Path                 | Type   | Example                      |
| ---------------------- | --------------------------- | ------ | ---------------------------- |
| Color (text and icons) | `style.color`               | RGB    | `{ r: 255, g: 0, b: 0 }`     |
| Background Color       | `style.background_color`    | RGB    | `{ r: 0, g: 0, b: 0 }`       |
| Shadow Color           | `style.shadow_color`        | RGB    | `{ r: 128, g: 128, b: 128 }` |
| Sensors Color          | `style.sensors_color`       | RGB    | `{ r: 0, g: 255, b: 0 }`     |
| Sensors Icon Size      | `style.sensors_icon_size`   | String | `"20px"`                     |
| Sensors Button Size    | `style.sensors_button_size` | String | `"36px"`                     |
| Buttons Color          | `style.buttons_color`       | RGB    | `{ r: 0, g: 0, b: 255 }`     |
| Buttons Icon Size      | `style.buttons_icon_size`   | String | `"22px"`                     |
| Buttons Button Size    | `style.buttons_button_size` | String | `"44px"`                     |

### Example Workflow

**Step 1: Set background color via GUI**

1. Click the "Background Color" field
2. Pick a color (e.g., black)
3. Click "Save"

**Step 2: Verify in YAML**
Switch to "Show Code Editor" and you'll see:

```yaml
type: custom:area-overview-card
title: Living Room
style:
  background_color: { r: 0, g: 0, b: 0 }
```

**Step 3: Add more styles**
Switch back to visual editor and set more colors. They all accumulate under `style:`.

## Testing GUI Editor Changes

### Manual Verification Steps

1. **Create a new card** in the visual editor
2. **Set a style option** (e.g., background color → black)
3. **Switch to YAML editor** and verify `style:` block exists
4. **Switch back to visual editor** and verify the value is still there
5. **Save the card** and verify the visual appearance changed

### Expected Behavior

✅ **Correct**: When you change a color in the GUI editor:

- The color picker shows your selection
- Switching to YAML shows `style.background_color` in the config
- The card's visual appearance updates immediately
- The value persists when you close and reopen the editor

❌ **If these don't happen**, possible causes:

- Browser cache (clear and reload)
- Old HACS version (update from HACS)
- Old card version (update to latest)

## Code Implementation Details

### Core Method: `_updateConfigValue`

Located in `src/editor.ts` (lines 695-747), this method:

```typescript
private _updateConfigValue(configPath: string, value: any): void {
  const newConfig = { ...this.config };
  const parts = configPath.split('.'); // Split "style.color" → ["style", "color"]

  // Security: Check for dangerous keys
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  for (const part of parts) {
    if (dangerousKeys.includes(part)) {
      console.error('Attempted to set dangerous property:', configPath);
      return;
    }
  }

  let current: any = newConfig;

  // Navigate/create nested path
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!Object.prototype.hasOwnProperty.call(current, part)) {
      current[part] = Object.create(null);
      Object.setPrototypeOf(current[part], Object.prototype);
    }
    current = current[part];
  }

  // Set the final value
  const lastPart = parts[parts.length - 1];
  if (value === undefined || value === '') {
    delete current[lastPart];
  } else {
    current[lastPart] = value;
  }

  // Update config and fire event
  this.config = newConfig;
  fireEvent(this, 'config-changed', { config: this.config });
}
```

### Color Handler: `_colorChanged`

Located in `src/editor.ts` (lines 606-624):

```typescript
private _colorChanged(ev: any): void {
  ev.stopPropagation();
  if (!this.config || !this.hass) return;

  // Use currentTarget to get the ha-selector element where configValue was set
  const target = ev.currentTarget;
  const configValue = target.configValue as string | undefined; // e.g., "style.color"

  if (!configValue) return;

  // Normalize RGB value (strip alpha channel if present)
  const value = this._normalizeColorValue(ev.detail?.value);

  // Update the nested config path
  this._updateConfigValue(configValue, value);
}
```

### How Nested Paths Work

Example: Setting `style.color` to red `{ r: 255, g: 0, b: 0 }`

1. `configValue = "style.color"`
2. Split → `["style", "color"]`
3. Navigate to `config.style` (create if missing)
4. Set `config.style.color = { r: 255, g: 0, b: 0 }`
5. Fire `config-changed` event
6. Home Assistant updates the card configuration

## Integration Tests

Added 25 comprehensive tests in `test/editor-integration.test.ts`:

### Test Coverage

| Category             | Tests | Description                                          |
| -------------------- | ----- | ---------------------------------------------------- |
| GUI color changes    | 5     | Verify each color option creates nested style object |
| Multiple changes     | 2     | Verify changes accumulate without data loss          |
| YAML/GUI consistency | 2     | Verify manual YAML preserved when using GUI          |
| Text fields          | 4     | Verify size options work correctly                   |
| Alignment            | 3     | Verify alignment options create nested paths         |
| Entity arrays        | 3     | Verify array index notation works                    |
| Clearing values      | 2     | Verify undefined/empty string deletes property       |
| Security             | 4     | Verify prototype pollution prevention                |

### Running Tests

```bash
# Run all tests
npm test
# Result: 189 passed

# Run only integration tests
npm test -- test/editor-integration.test.ts
# Result: 25 passed

# Run with coverage
npm run coverage
```

## Troubleshooting

### Issue: GUI changes don't save

**Symptoms**: Color changes in GUI editor don't appear in YAML or card appearance

**Possible Causes**:

1. **Browser cache** - Clear browser cache and hard reload (Ctrl+Shift+R)
2. **Old version** - Update card via HACS to latest version
3. **Bundle not loaded** - Check browser console for JavaScript errors
4. **Wrong file** - Verify HACS installed `dist/homeassistant-area-card-custom.js`

**Verification Steps**:

1. Open browser developer console (F12)
2. Go to Network tab
3. Filter for `.js` files
4. Reload page
5. Verify `homeassistant-area-card-custom.js` loads successfully
6. Check file size matches built bundle (~71KB)

### Issue: YAML shows old format

**Symptom**: Config shows `background_color` at top level instead of `style.background_color`

**Explanation**: This is the deprecated format but still works. The card automatically migrates it internally.

**Solution**: Either format works, but for consistency:

```yaml
# Old (deprecated but works)
background_color: '#000000'

# New (recommended)
style:
  background_color: { r: 0, g: 0, b: 0 }
```

## Conclusion

The GUI editor is **fully functional** and correctly handles nested style paths. All verification tests pass, security scans are clean, and the implementation follows best practices.

Users experiencing issues should:

1. Clear browser cache
2. Update to latest version via HACS
3. Verify the correct bundle is loaded
4. Check browser console for errors

For new feature requests or bugs, please open an issue on GitHub with:

- Browser version
- Home Assistant version
- Card version
- Steps to reproduce
- Browser console errors (if any)
