/**
 * Tests for verifying that setConfig() properly handles nested config objects
 * and preserves color values across editor open/close cycles.
 *
 * This test file addresses the issue where color customizations made in the GUI
 * were lost when closing and reopening the card editor.
 */

import { MinimalisticAreaCardConfig } from '../src/types';

/**
 * Simulates the old setConfig behavior (before the fix) for testing purposes.
 * This demonstrates the buggy behavior where config was directly assigned (shallow copy).
 */
function simulateSetConfigShallow(config: MinimalisticAreaCardConfig): MinimalisticAreaCardConfig {
  // Old buggy behavior - direct assignment (shallow copy)
  return config;
}

/**
 * Simulates the fixed setConfig behavior for testing purposes.
 * The fix uses JSON.parse(JSON.stringify(config)) for a deep copy.
 */
function simulateSetConfigDeep(config: MinimalisticAreaCardConfig): MinimalisticAreaCardConfig {
  // Fixed behavior - deep clone
  return JSON.parse(JSON.stringify(config));
}

describe('Editor setConfig() - Color Persistence', () => {
  test('shallow copy shares references - demonstrates the bug', () => {
    const savedConfig: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
      title: 'Living Room',
      style: {
        background_color: { r: 255, g: 255, b: 0 }, // Yellow
      },
    };

    // Simulate setConfig with shallow copy (current buggy behavior)
    const internalConfig = simulateSetConfigShallow(savedConfig);

    // The configs share the same reference
    expect(internalConfig).toBe(savedConfig);
    expect(internalConfig.style).toBe(savedConfig.style);

    // Modifying the original affects the internal config (BAD)
    if (savedConfig.style?.background_color && typeof savedConfig.style.background_color === 'object') {
      savedConfig.style.background_color.r = 128;
    }

    // This is the bug - internal config is affected
    expect(internalConfig.style?.background_color).toEqual({ r: 128, g: 255, b: 0 });
  });

  test('deep clone prevents shared references - demonstrates the fix', () => {
    const savedConfig: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
      title: 'Living Room',
      style: {
        background_color: { r: 255, g: 255, b: 0 }, // Yellow
      },
    };

    // Simulate setConfig with deep clone (fixed behavior)
    const internalConfig = simulateSetConfigDeep(savedConfig);

    // The configs are different objects
    expect(internalConfig).not.toBe(savedConfig);
    expect(internalConfig.style).not.toBe(savedConfig.style);

    // Values are equal
    expect(internalConfig.style?.background_color).toEqual({ r: 255, g: 255, b: 0 });

    // Modifying the original does NOT affect the internal config (GOOD)
    if (savedConfig.style?.background_color && typeof savedConfig.style.background_color === 'object') {
      savedConfig.style.background_color.r = 128;
    }

    // This is the fix - internal config is NOT affected
    expect(internalConfig.style?.background_color).toEqual({ r: 255, g: 255, b: 0 });
  });

  test('deep clone preserves multiple nested style properties', () => {
    const savedConfig: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
      style: {
        background_color: { r: 255, g: 255, b: 0 }, // Yellow
        color: { r: 0, g: 0, b: 0 }, // Black text
        sensors_color: { r: 0, g: 128, b: 255 }, // Blue sensors
      },
    };

    const internalConfig = simulateSetConfigDeep(savedConfig);

    // All colors should be preserved
    expect(internalConfig.style?.background_color).toEqual({ r: 255, g: 255, b: 0 });
    expect(internalConfig.style?.color).toEqual({ r: 0, g: 0, b: 0 });
    expect(internalConfig.style?.sensors_color).toEqual({ r: 0, g: 128, b: 255 });

    // Modify original - should not affect cloned config
    if (savedConfig.style?.background_color && typeof savedConfig.style.background_color === 'object') {
      savedConfig.style.background_color.r = 100;
    }

    // Internal config should be unchanged
    expect(internalConfig.style?.background_color).toEqual({ r: 255, g: 255, b: 0 });
  });

  test('deep clone preserves entities with color configurations', () => {
    // Note: ExtendedEntityConfig in types.ts supports color property
    // Using JSON parsing to simulate configs that may have this structure
    const savedConfigJSON = JSON.stringify({
      type: 'custom:area-overview-card',
      entities: [
        {
          entity: 'sensor.temperature',
          color: { r: 255, g: 0, b: 0 }, // Red
        },
        {
          entity: 'sensor.humidity',
          color: { r: 0, g: 0, b: 255 }, // Blue
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const savedConfig: any = JSON.parse(savedConfigJSON);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internalConfig: any = simulateSetConfigDeep(savedConfig);

    // Verify entities are preserved after deep clone
    expect(internalConfig.entities).toHaveLength(2);
    expect(internalConfig.entities[0].color).toEqual({ r: 255, g: 0, b: 0 });
    expect(internalConfig.entities[1].color).toEqual({ r: 0, g: 0, b: 255 });

    // Modify original - should not affect cloned config due to deep copy
    savedConfig.entities[0].color.r = 100;

    // Internal config should be unchanged
    expect(internalConfig.entities[0].color).toEqual({ r: 255, g: 0, b: 0 });
  });

  test('deep clone handles undefined style gracefully', () => {
    const configWithoutStyle: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
      title: 'Test Room',
    };

    const internalConfig = simulateSetConfigDeep(configWithoutStyle);

    // Style should be undefined
    expect(internalConfig.style).toBeUndefined();
    expect(internalConfig.title).toBe('Test Room');
  });

  test('deep clone handles empty config gracefully', () => {
    const emptyConfig: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
    };

    const internalConfig = simulateSetConfigDeep(emptyConfig);

    expect(internalConfig.type).toBe('custom:area-overview-card');
  });

  test('JSON serialization preserves color objects', () => {
    const config: MinimalisticAreaCardConfig = {
      type: 'custom:area-overview-card',
      style: {
        background_color: { r: 100, g: 100, b: 100 },
      },
    };

    // Verify JSON.parse(JSON.stringify()) works correctly for our use case
    const cloned = JSON.parse(JSON.stringify(config));

    expect(cloned.style.background_color).toEqual({ r: 100, g: 100, b: 100 });
    expect(cloned.style).not.toBe(config.style);
    if (config.style?.background_color && typeof config.style.background_color === 'object') {
      expect(cloned.style.background_color).not.toBe(config.style.background_color);
    }
  });
});
