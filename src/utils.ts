import { html } from 'lit';
import {
  cardType,
  cssCardVariablesPrefix,
  ColorValue,
  EntityStateConfig,
  HomeAssistantExt,
  StyleOptions,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function evalTemplate(entity: string | null | undefined, template: string, hass: HomeAssistantExt): any {
  const trimmed = template.trim();
  if (!(trimmed.startsWith('${') && trimmed.endsWith('}'))) {
    return template;
  }
  let func = trimmed.slice(2, -1);
  if (!func.toLocaleLowerCase().startsWith('return')) {
    func = `return ${func}`;
  }

  try {
    return new Function('hass', 'state', 'user', 'html', 'helpers', `'use strict'; ${func}`).call(
      null,
      hass,
      entity !== null && entity !== undefined ? hass.states[entity].state : null,
      hass.user,
      html,
      getTemplateHelpers(entity, hass),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const funcTrimmed = func.length <= 100 ? func.trim() : `${func.substring(0, 98)}...`;
    e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
    e.name = 'MinimalistAreaCardJSTemplateError';
    throw e;
  }
}

export function filterStateConfigs(
  entity: string,
  config: EntityStateConfig[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentValue: any,
  hass: HomeAssistantExt,
): EntityStateConfig | undefined {
  let defaultValue;
  const match = config?.filter((c) => {
    switch (c.operator?.trim().toLocaleLowerCase() || '==') {
      case '<':
        return currentValue < c.value;
      case '<=':
        return currentValue <= c.value;
      case '==':
        return currentValue == c.value;
      case '>=':
        return currentValue >= c.value;
      case '>':
        return currentValue > c.value;
      case '!=':
        return currentValue != c.value;
      case 'regex':
        return String(currentValue).match(c.value) ? true : false;
      case 'template':
        return getOrDefault(entity, c.value, hass, false) == true;
      case 'default':
        defaultValue = c;
        return false;
      default:
        return false;
    }
  });
  if (match?.length > 0) {
    return match[0];
  }
  return defaultValue;
}

export function deprecatedWarning(message): void {
  console.warn('[DEPRECATED][%s] %s', cardType, message);
}

function getTemplateHelpers(entityId: string | null | undefined, hass: HomeAssistantExt): object {
  const unknownValue = 'unknown';
  const unavailableValue = 'unavailable';
  const states = (entity: string): string => {
    if (entity in hass.states) {
      if ('state' in hass.states[entity]) {
        return hass.states[entity].state;
      }
      return unavailableValue;
    }
    return unknownValue;
  };

  const has_value = (entity: string): boolean => {
    return ![unknownValue, unavailableValue].includes(states(entity));
  };

  return {
    states: (entity: string): string => {
      return states(entity);
    },
    state_attr: (entity: string, attr: string | null): string | null => {
      if (!attr && entityId) {
        attr = entity;
        entity = entityId;
      }
      if (attr && has_value(entity) && attr in hass.states[entity].attributes) {
        return hass.states[entity].attributes[attr];
      }
      return null;
    },
    is_state: (entity: string | Array<string>, value: string | Array<string> | null): boolean => {
      if (!value && entityId) {
        value = entity;
        entity = entityId;
      }
      if (typeof entity === 'string') {
        const state = states(entity);
        if (Array.isArray(value)) {
          return value.includes(state);
        }
        return value == state;
      }
      return false;
    },
    is_state_attr: (
      entity: string,
      attr: string | Array<string> | null,
      value: string | Array<string> | null,
    ): boolean => {
      if (!value && entityId) {
        value = attr;
        attr = entity;
        entity = entityId;
      }
      if (typeof attr == 'string') {
        if (attr in hass.states[entity]?.attributes) {
          if (Array.isArray(value)) {
            return value.includes(hass.states[entity].attributes[attr]);
          }
          return value == hass.states[entity].attributes[attr];
        }
      }
      return false;
    },
    has_value: (entity: string | null): boolean => {
      if (!entity && entityId) {
        entity = entityId;
      }
      if (entity) {
        return has_value(entity);
      }
      return false;
    },
  };
}

export function getOrDefault(
  entity: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  hass: HomeAssistantExt,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value === 'string') {
    try {
      const templated = evalTemplate(entity, value, hass);

      if (templated === undefined || templated === null) {
        return defaultValue;
      } else {
        return templated;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error in template %s: ', value, e);
      return defaultValue;
    }
  }
  return value;
}

export function buildCssVariables(
  cfg: StyleOptions,
  entityId: string | null | undefined,
  hass: HomeAssistantExt,
  mushroomStyle = false,
): object {
  const mapping = [
    { key: 'color', ccs: `${cssCardVariablesPrefix}color` },
    { key: 'background_color', ccs: `${cssCardVariablesPrefix}background-color` },
    { key: 'sensors_color', ccs: `${cssCardVariablesPrefix}sensors-color` },
    { key: 'sensors_icon_size', ccs: `${cssCardVariablesPrefix}sensors-icon-size` },
    { key: 'sensors_button_size', ccs: `${cssCardVariablesPrefix}sensors-button-size` },
    { key: 'buttons_icon_size', ccs: `${cssCardVariablesPrefix}buttons-icon-size` },
    { key: 'buttons_button_size', ccs: `${cssCardVariablesPrefix}buttons-button-size` },
    { key: 'buttons_color', ccs: `${cssCardVariablesPrefix}buttons-color` },
    { key: 'shadow_color', ccs: `${cssCardVariablesPrefix}shadow-color` },
  ];
  const result = {};
  mapping.forEach((m) => {
    if (cfg[m.key]) {
      const value = getOrDefault(entityId, cfg[m.key], hass, undefined);
      if (value !== undefined) {
        result[m.ccs] = colorValueToCSS(value);
      }
    }
  });

  // Apply Mushroom-style defaults when enabled and values are not explicitly set
  if (mushroomStyle) {
    // Apply soft, theme-aware background when background_color is not explicitly set
    if (!cfg.background_color) {
      result[`${cssCardVariablesPrefix}background-color`] = 'rgba(var(--rgb-card-background-color, 18, 22, 28), 0.96)';
    }

    // Apply Mushroom-style icon/button sizes when not explicitly set
    if (!cfg.sensors_icon_size) {
      result[`${cssCardVariablesPrefix}sensors-icon-size`] = '20px';
    }
    if (!cfg.sensors_button_size) {
      result[`${cssCardVariablesPrefix}sensors-button-size`] = '36px';
    }
    if (!cfg.buttons_icon_size) {
      result[`${cssCardVariablesPrefix}buttons-icon-size`] = '22px';
    }
    if (!cfg.buttons_button_size) {
      result[`${cssCardVariablesPrefix}buttons-button-size`] = '44px';
    }
  }

  return result;
}

/**
 * Convert a ColorValue (RGB object or string) to a CSS color string
 */
export function colorValueToCSS(color: ColorValue | undefined): string | undefined {
  if (!color) {
    return undefined;
  }

  if (typeof color === 'string') {
    return color;
  }

  // Convert RGB object to rgba string
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Convert a CSS color string to an RGB object
 * Handles hex, rgb, rgba formats
 */
export function cssToRGB(color: string | undefined): { r: number; g: number; b: number } | undefined {
  if (!color) {
    return undefined;
  }

  // Remove whitespace
  const trimmed = color.trim();

  // Handle hex format (#RGB or #RRGGBB)
  if (trimmed.startsWith('#')) {
    const hex = trimmed.substring(1);
    let r, g, b;

    if (hex.length === 3) {
      // #RGB format
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      // #RRGGBB format
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return undefined;
    }

    // Validate that we got valid numbers
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return undefined;
    }

    return { r, g, b };
  }

  // Handle rgb() or rgba() format
  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  return undefined;
}
