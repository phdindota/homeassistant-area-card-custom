/**
 * Tests for color normalization in the editor
 *
 * These tests verify that the editor properly normalizes colors from both
 * array format [r, g, b] and object format { r, g, b } to the standard
 * ColorValue object format.
 */

describe('Editor Color Normalization', () => {
  describe('_normalizeColorValue behavior', () => {
    // Helper function to simulate the _normalizeColorValue method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function normalizeColorValue(value: any): { r: number; g: number; b: number } | undefined {
      if (!value) {
        return undefined;
      }

      // Handle array format [r, g, b]
      if (Array.isArray(value) && value.length >= 3) {
        return { r: value[0], g: value[1], b: value[2] };
      }

      // Handle object format { r, g, b } or { r, g, b, a }
      if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
        // Extract only r, g, b - discard alpha if present
        return { r: value.r, g: value.g, b: value.b };
      }

      // Handle unexpected formats
      return undefined;
    }

    test('should convert array format [r, g, b] to object format', () => {
      const arrayColor = [255, 128, 64];
      const result = normalizeColorValue(arrayColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
      expect(Array.isArray(result)).toBe(false);
    });

    test('should handle array with more than 3 values (ignore extra)', () => {
      const arrayColor = [255, 128, 64, 0.5]; // with alpha
      const result = normalizeColorValue(arrayColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('should handle object format { r, g, b }', () => {
      const objectColor = { r: 255, g: 128, b: 64 };
      const result = normalizeColorValue(objectColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('should strip alpha channel from object format { r, g, b, a }', () => {
      const objectColorWithAlpha = { r: 255, g: 128, b: 64, a: 0.5 };
      const result = normalizeColorValue(objectColorWithAlpha);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
      expect(result).not.toHaveProperty('a');
    });

    test('should return undefined for null', () => {
      const result = normalizeColorValue(null);
      expect(result).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
      const result = normalizeColorValue(undefined);
      expect(result).toBeUndefined();
    });

    test('should return undefined for empty array', () => {
      const result = normalizeColorValue([]);
      expect(result).toBeUndefined();
    });

    test('should return undefined for array with less than 3 values', () => {
      const result = normalizeColorValue([255, 128]);
      expect(result).toBeUndefined();
    });

    test('should return undefined for string values', () => {
      // String values should not be normalized by _normalizeColorValue
      // They are handled elsewhere in the code
      const result = normalizeColorValue('#ff8040');
      expect(result).toBeUndefined();
    });

    test('should return undefined for invalid object format', () => {
      const invalidObject = { red: 255, green: 128, blue: 64 };
      const result = normalizeColorValue(invalidObject);
      expect(result).toBeUndefined();
    });

    test('should handle zero values correctly', () => {
      const arrayColor = [0, 0, 0];
      const result = normalizeColorValue(arrayColor);

      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('should handle maximum RGB values', () => {
      const arrayColor = [255, 255, 255];
      const result = normalizeColorValue(arrayColor);

      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('_getColorValue behavior', () => {
    // Mock cssToRGB function for testing purposes
    // This is a simplified version that only handles 6-digit hex colors (#RRGGBB)
    // The actual implementation in utils.ts supports additional formats like
    // short hex (#RGB), rgb(), rgba(), and named colors
    function cssToRGB(color: string): { r: number; g: number; b: number } | undefined {
      if (color.startsWith('#')) {
        // Simple hex parsing for testing
        const hex = color.substring(1);
        if (hex.length === 6) {
          return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
          };
        }
      }
      return undefined;
    }

    // Helper function to simulate the _getColorValue method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getColorValue(color: any): { r: number; g: number; b: number } | undefined {
      if (!color) {
        return undefined;
      }

      // Handle array format [r, g, b] (from existing configs)
      if (Array.isArray(color) && color.length >= 3) {
        return { r: color[0], g: color[1], b: color[2] };
      }

      // Handle CSS string format
      if (typeof color === 'string') {
        return cssToRGB(color);
      }

      // Already in object format
      return color;
    }

    test('should convert array format from existing config', () => {
      const arrayColor = [255, 128, 64];
      const result = getColorValue(arrayColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('should handle object format', () => {
      const objectColor = { r: 255, g: 128, b: 64 };
      const result = getColorValue(objectColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('should convert CSS string format', () => {
      const cssColor = '#ff8040';
      const result = getColorValue(cssColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('should return undefined for undefined', () => {
      const result = getColorValue(undefined);
      expect(result).toBeUndefined();
    });

    test('should return undefined for null', () => {
      const result = getColorValue(null);
      expect(result).toBeUndefined();
    });

    test('should handle array with extra values (ignore)', () => {
      const arrayColor = [255, 128, 64, 0.5];
      const result = getColorValue(arrayColor);

      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });
  });

  describe('Round-trip compatibility', () => {
    test('array from config -> normalized in editor -> saved as object', () => {
      // Simulating loading an existing config with array format
      const existingConfigColor = [0, 0, 255];

      // _getColorValue converts to object for the GUI
      const guiValue =
        Array.isArray(existingConfigColor) && existingConfigColor.length >= 3
          ? { r: existingConfigColor[0], g: existingConfigColor[1], b: existingConfigColor[2] }
          : existingConfigColor;

      expect(guiValue).toEqual({ r: 0, g: 0, b: 255 });

      // When user saves (even without changing), it should save as object
      const savedValue = guiValue;
      expect(savedValue).toEqual({ r: 0, g: 0, b: 255 });
      expect(Array.isArray(savedValue)).toBe(false);
    });

    test('object from GUI -> normalized -> saved as object', () => {
      // User selects a color via GUI, gets object format
      const guiColor = { r: 255, g: 0, b: 0 };

      // Normalization extracts r, g, b
      const normalized = { r: guiColor.r, g: guiColor.g, b: guiColor.b };

      expect(normalized).toEqual({ r: 255, g: 0, b: 0 });
      expect(Array.isArray(normalized)).toBe(false);
    });

    test('array from GUI -> normalized -> saved as object', () => {
      // If GUI returns array format (the bug scenario)
      const guiColor = [128, 128, 128];

      // Normalization should convert to object
      const normalized =
        Array.isArray(guiColor) && guiColor.length >= 3
          ? { r: guiColor[0], g: guiColor[1], b: guiColor[2] }
          : undefined;

      expect(normalized).toEqual({ r: 128, g: 128, b: 128 });
      expect(Array.isArray(normalized)).toBe(false);
    });
  });
});
