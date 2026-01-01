/**
 * Integration tests for the Area Overview Card Editor
 * Verifying that GUI changes to style options are correctly saved to nested config paths
 */

describe('Editor Integration - Nested Style Config', () => {
  /**
   * Simulates the _updateConfigValue method from the editor
   * This is the core logic that handles nested path updates
   */
  function updateConfigValue(config: Record<string, any>, configPath: string, value: any): Record<string, any> {
    const newConfig = { ...config };
    const parts = configPath.split('.');

    // Guard against prototype pollution
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const part of parts) {
      if (dangerousKeys.includes(part)) {
        console.error('Attempted to set dangerous property:', configPath);
        return config; // Return unchanged
      }
    }

    let current: any = newConfig;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (part.match(/^\d+$/)) {
        const index = parseInt(part);
        if (!Object.prototype.hasOwnProperty.call(current, index)) {
          current[index] = {};
        }
        current = current[index];
      } else {
        if (!Object.prototype.hasOwnProperty.call(current, part)) {
          current[part] = Object.create(null);
          Object.setPrototypeOf(current[part], Object.prototype);
        }
        current = current[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    if (dangerousKeys.includes(lastPart)) {
      console.error('Attempted to set dangerous property:', configPath);
      return config;
    }

    if (value === undefined || value === '') {
      delete current[lastPart];
    } else {
      current[lastPart] = value;
    }

    return newConfig;
  }

  describe('GUI color changes create nested style objects', () => {
    test('should create style.color when setting color via GUI', () => {
      const initialConfig = {
        type: 'custom:area-overview-card',
        title: 'Living Room',
      };

      const updatedConfig = updateConfigValue(initialConfig, 'style.color', { r: 255, g: 0, b: 0 });

      expect(updatedConfig).toHaveProperty('style');
      expect(updatedConfig.style).toHaveProperty('color');
      expect(updatedConfig.style.color).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('should create style.background_color when setting background via GUI', () => {
      const initialConfig = {
        type: 'custom:area-overview-card',
        title: 'Kitchen',
      };

      const updatedConfig = updateConfigValue(initialConfig, 'style.background_color', { r: 0, g: 0, b: 0 });

      expect(updatedConfig).toHaveProperty('style');
      expect(updatedConfig.style).toHaveProperty('background_color');
      expect(updatedConfig.style.background_color).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('should create style.sensors_color when setting sensors color via GUI', () => {
      const initialConfig = {
        type: 'custom:area-overview-card',
      };

      const updatedConfig = updateConfigValue(initialConfig, 'style.sensors_color', { r: 0, g: 255, b: 0 });

      expect(updatedConfig).toHaveProperty('style');
      expect(updatedConfig.style).toHaveProperty('sensors_color');
      expect(updatedConfig.style.sensors_color).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('should create style.buttons_color when setting buttons color via GUI', () => {
      const initialConfig = {
        type: 'custom:area-overview-card',
      };

      const updatedConfig = updateConfigValue(initialConfig, 'style.buttons_color', { r: 0, g: 0, b: 255 });

      expect(updatedConfig).toHaveProperty('style');
      expect(updatedConfig.style).toHaveProperty('buttons_color');
      expect(updatedConfig.style.buttons_color).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('should create style.shadow_color when setting shadow color via GUI', () => {
      const initialConfig = {
        type: 'custom:area-overview-card',
      };

      const updatedConfig = updateConfigValue(initialConfig, 'style.shadow_color', { r: 128, g: 128, b: 128 });

      expect(updatedConfig).toHaveProperty('style');
      expect(updatedConfig.style).toHaveProperty('shadow_color');
      expect(updatedConfig.style.shadow_color).toEqual({ r: 128, g: 128, b: 128 });
    });
  });

  describe('Multiple GUI changes accumulate correctly', () => {
    test('should preserve existing style values when adding new ones', () => {
      let config: any = {
        type: 'custom:area-overview-card',
        title: 'Test',
      };

      // Simulate user changing color via GUI
      config = updateConfigValue(config, 'style.color', { r: 255, g: 0, b: 0 });

      // Then changing background color
      config = updateConfigValue(config, 'style.background_color', { r: 0, g: 0, b: 0 });

      // Then changing sensors color
      config = updateConfigValue(config, 'style.sensors_color', { r: 0, g: 255, b: 0 });

      // All three should be present
      expect(config.style).toEqual({
        color: { r: 255, g: 0, b: 0 },
        background_color: { r: 0, g: 0, b: 0 },
        sensors_color: { r: 0, g: 255, b: 0 },
      });
    });

    test('should update existing style value when changed via GUI', () => {
      let config: any = {
        type: 'custom:area-overview-card',
        style: {
          color: { r: 100, g: 100, b: 100 },
        },
      };

      // User changes color to red
      config = updateConfigValue(config, 'style.color', { r: 255, g: 0, b: 0 });

      expect(config.style.color).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe('Manual YAML and GUI consistency', () => {
    test('should preserve manual YAML style values when adding GUI changes', () => {
      let config: any = {
        type: 'custom:area-overview-card',
        style: {
          color: '#ff0000', // Manually set in YAML as CSS string
          sensors_icon_size: '20px',
        },
      };

      // User adds background color via GUI
      config = updateConfigValue(config, 'style.background_color', { r: 0, g: 0, b: 0 });

      // Should preserve both the manual YAML values and add the GUI value
      expect(config.style.color).toBe('#ff0000');
      expect(config.style.sensors_icon_size).toBe('20px');
      expect(config.style.background_color).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('should handle mixed color formats (string and RGB object)', () => {
      let config: any = {
        type: 'custom:area-overview-card',
        style: {
          color: '#ff0000', // CSS string from manual YAML
        },
      };

      // User sets background via GUI (RGB object)
      config = updateConfigValue(config, 'style.background_color', { r: 0, g: 0, b: 0 });

      expect(typeof config.style.color).toBe('string');
      expect(typeof config.style.background_color).toBe('object');
    });
  });

  describe('Text style fields work correctly', () => {
    test('should handle style.sensors_icon_size as string', () => {
      const config = updateConfigValue({ type: 'custom:area-overview-card' }, 'style.sensors_icon_size', '20px');

      expect(config.style.sensors_icon_size).toBe('20px');
    });

    test('should handle style.sensors_button_size as string', () => {
      const config = updateConfigValue({ type: 'custom:area-overview-card' }, 'style.sensors_button_size', '36px');

      expect(config.style.sensors_button_size).toBe('36px');
    });

    test('should handle style.buttons_icon_size as string', () => {
      const config = updateConfigValue({ type: 'custom:area-overview-card' }, 'style.buttons_icon_size', '22px');

      expect(config.style.buttons_icon_size).toBe('22px');
    });

    test('should handle style.buttons_button_size as string', () => {
      const config = updateConfigValue({ type: 'custom:area-overview-card' }, 'style.buttons_button_size', '44px');

      expect(config.style.buttons_button_size).toBe('44px');
    });
  });

  describe('Alignment fields work correctly', () => {
    test('should create nested align.title property', () => {
      const config: any = updateConfigValue({ type: 'custom:area-overview-card' }, 'align.title', 'center');

      expect(config).toHaveProperty('align');
      expect(config.align.title).toBe('center');
    });

    test('should create nested align.sensors property', () => {
      const config: any = updateConfigValue({ type: 'custom:area-overview-card' }, 'align.sensors', 'right');

      expect(config).toHaveProperty('align');
      expect(config.align.sensors).toBe('right');
    });

    test('should preserve multiple alignment values', () => {
      let config: any = { type: 'custom:area-overview-card' };
      config = updateConfigValue(config, 'align.title', 'center');
      config = updateConfigValue(config, 'align.sensors', 'left');
      config = updateConfigValue(config, 'align.buttons', 'right');

      expect(config.align).toEqual({
        title: 'center',
        sensors: 'left',
        buttons: 'right',
      });
    });
  });

  describe('Entity fields work with array indices', () => {
    test('should handle entities.0.entity path', () => {
      const config: any = {
        type: 'custom:area-overview-card',
        entities: [{}],
      };

      const updated: any = updateConfigValue(config, 'entities.0.entity', 'sensor.temperature');

      expect(updated.entities[0].entity).toBe('sensor.temperature');
    });

    test('should handle entities.0.color path', () => {
      const config: any = {
        type: 'custom:area-overview-card',
        entities: [{ entity: 'sensor.temp' }],
      };

      const updated: any = updateConfigValue(config, 'entities.0.color', { r: 255, g: 0, b: 0 });

      expect(updated.entities[0].color).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('should handle multiple entity configurations', () => {
      let config: any = {
        type: 'custom:area-overview-card',
        entities: [{}, {}],
      };

      config = updateConfigValue(config, 'entities.0.entity', 'sensor.temperature');
      config = updateConfigValue(config, 'entities.0.color', { r: 255, g: 0, b: 0 });
      config = updateConfigValue(config, 'entities.1.entity', 'sensor.humidity');
      config = updateConfigValue(config, 'entities.1.color', { r: 0, g: 0, b: 255 });

      expect(config.entities[0].entity).toBe('sensor.temperature');
      expect(config.entities[0].color).toEqual({ r: 255, g: 0, b: 0 });
      expect(config.entities[1].entity).toBe('sensor.humidity');
      expect(config.entities[1].color).toEqual({ r: 0, g: 0, b: 255 });
    });
  });

  describe('Clearing values works correctly', () => {
    test('should delete property when value is undefined', () => {
      const config = {
        type: 'custom:area-overview-card',
        style: {
          color: { r: 255, g: 0, b: 0 },
          background_color: { r: 0, g: 0, b: 0 },
        },
      };

      const updated = updateConfigValue(config, 'style.color', undefined);

      expect(updated.style).not.toHaveProperty('color');
      expect(updated.style.background_color).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('should delete property when value is empty string', () => {
      const config = {
        type: 'custom:area-overview-card',
        style: {
          sensors_icon_size: '20px',
        },
      };

      const updated = updateConfigValue(config, 'style.sensors_icon_size', '');

      expect(updated.style).not.toHaveProperty('sensors_icon_size');
    });
  });

  describe('Security: prototype pollution prevention', () => {
    test('should reject __proto__ in path', () => {
      const config = { type: 'custom:area-overview-card' };
      const updated = updateConfigValue(config, '__proto__.polluted', 'bad');

      expect(updated).toEqual(config); // Should remain unchanged
      expect((updated as any).__proto__).not.toHaveProperty('polluted');
    });

    test('should reject constructor in path', () => {
      const config = { type: 'custom:area-overview-card' };
      const updated = updateConfigValue(config, 'constructor.polluted', 'bad');

      expect(updated).toEqual(config);
    });

    test('should reject prototype in path', () => {
      const config = { type: 'custom:area-overview-card' };
      const updated = updateConfigValue(config, 'style.__proto__.polluted', 'bad');

      expect(updated).toEqual(config);
    });

    test('should reject dangerous key as last part', () => {
      const config = { type: 'custom:area-overview-card', style: {} };
      const updated = updateConfigValue(config, 'style.__proto__', 'bad');

      expect(updated).toEqual(config);
    });
  });
});
