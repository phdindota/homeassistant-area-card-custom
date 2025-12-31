import { colorValueToCSS, cssToRGB } from '../src/utils';
import { ColorValue } from '../src/types';

describe('Color conversion utilities', () => {
  describe('colorValueToCSS', () => {
    test('converts RGB object to CSS string', () => {
      const rgb = { r: 255, g: 128, b: 64 };
      expect(colorValueToCSS(rgb)).toBe('rgb(255, 128, 64)');
    });

    test('returns string color as-is', () => {
      expect(colorValueToCSS('#ff8040')).toBe('#ff8040');
      expect(colorValueToCSS('red')).toBe('red');
      expect(colorValueToCSS('rgba(255, 128, 64, 0.5)')).toBe('rgba(255, 128, 64, 0.5)');
    });

    test('returns undefined for undefined input', () => {
      expect(colorValueToCSS(undefined)).toBeUndefined();
    });
  });

  describe('cssToRGB', () => {
    test('converts hex color (#RRGGBB) to RGB object', () => {
      const result = cssToRGB('#ff8040');
      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('converts short hex color (#RGB) to RGB object', () => {
      const result = cssToRGB('#f84');
      expect(result).toEqual({ r: 255, g: 136, b: 68 });
    });

    test('converts rgb() format to RGB object', () => {
      const result = cssToRGB('rgb(255, 128, 64)');
      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('converts rgba() format to RGB object (ignores alpha)', () => {
      const result = cssToRGB('rgba(255, 128, 64, 0.5)');
      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('handles colors with whitespace', () => {
      const result = cssToRGB('  #ff8040  ');
      expect(result).toEqual({ r: 255, g: 128, b: 64 });
    });

    test('returns undefined for undefined input', () => {
      expect(cssToRGB(undefined)).toBeUndefined();
    });

    test('returns undefined for invalid hex format', () => {
      expect(cssToRGB('#zzz')).toBeUndefined();
      expect(cssToRGB('#12')).toBeUndefined();
      expect(cssToRGB('#1234567')).toBeUndefined();
    });

    test('returns undefined for invalid color string', () => {
      expect(cssToRGB('not-a-color')).toBeUndefined();
    });
  });

  describe('round-trip conversion', () => {
    test('RGB object -> CSS -> RGB object', () => {
      const original: ColorValue = { r: 255, g: 128, b: 64 };
      const css = colorValueToCSS(original);
      const result = cssToRGB(css!);
      expect(result).toEqual(original);
    });

    test('hex color -> RGB object -> CSS', () => {
      const original = '#ff8040';
      const rgb = cssToRGB(original);
      const css = colorValueToCSS(rgb);
      expect(css).toBe('rgb(255, 128, 64)');
    });
  });
});
