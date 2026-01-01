# Area Overview Card (Home Assistant Lovelace Card)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

A **Home Assistant Lovelace custom card** named "Area Overview Card" that displays area information with sensors and controllable entities in a clean, minimalistic design. Perfect for creating beautiful control panels for rooms and zones in your Home Assistant dashboard.

## Features

- 🏠 **Area-based organization**: Automatically pulls entities from Home Assistant areas or define your own
- 📊 **Smart entity display**: Shows numeric sensors with values, binary sensors with icons
- 🎛️ **Interactive controls**: Toggle switches and lights with tap/hold for more details
- 🎨 **Highly customizable**: Configure colors, icons, backgrounds, camera feeds, and layout alignment
- 📱 **Touch-friendly**: Optimized button sizes for mobile and tablet interfaces
- 🌈 **State-based styling**: Dynamic colors and icons based on entity states
- 🔧 **Visual editor**: User-friendly GUI configuration in addition to YAML
- 🖼️ **Background options**: Support for static images or live camera feeds

![Sample preview](docs/sample.png)

## Installation

### HACS (Recommended)

This card is distributed via [HACS][hacs] (Home Assistant Community Store) as a **custom repository**.

#### Installation Steps

1. **Install HACS** if you don't have it already (see [hacs.xyz](https://hacs.xyz))
2. **Open HACS** in Home Assistant (sidebar menu)
3. Click the **3-dot menu** in the top right corner
4. Select **"Custom repositories"**
5. In the "Add custom repository" dialog:
   - **Repository URL**: `https://github.com/phdindota/homeassistant-area-card-custom`
   - **Category**: Select **"Plugin"** (this is the correct category for custom Lovelace cards)

     > **Note:** Depending on your HACS version, the category might be labeled "Plugin", "Lovelace", or "Frontend". All refer to custom dashboard cards. Select the one available for Lovelace cards.

6. Click **"Add"**
7. Navigate to **Frontend** section in HACS (or **Plugins**)
8. Search for **"Area Overview Card"**
9. Click **Download** and confirm

#### Lovelace Resource Configuration

After installing via HACS, the card JavaScript file will be available at:

```
/hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js
```

HACS should automatically register this as a Lovelace resource. If you need to add it manually:

**Using UI:**

1. Go to _Settings_ → _Dashboards_ → _⋮ Menu_ → _Resources_
2. Click _Add Resource_
3. Set URL: `/hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js`
4. Set Resource type: `JavaScript Module`

**Using YAML:**

```yaml
resources:
  - url: /hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js
    type: module
```

> **Note:** If you don't see the Resources menu in the UI, enable _Advanced Mode_ in your User Profile settings.
>
> **Migration Note:** If you previously installed this card, you may need to update your resource URL from `/hacsfiles/homeassistant-area-card-custom/dist/better-minimalistic-area-card.js` to the new path above.

### Manual Installation

If you prefer not to use HACS:

1. **Download** the `homeassistant-area-card-custom.js` file from the [latest release][release-url]
2. **Copy** the file to your Home Assistant `config/www/` folder (create the folder if it doesn't exist)
3. **Add the resource** to your Lovelace configuration:

   **Using UI:**
   - Go to _Settings_ → _Dashboards_ → _⋮ Menu_ → _Resources_
   - Click _Add Resource_
   - Set URL: `/local/homeassistant-area-card-custom.js`
   - Set Resource type: `JavaScript Module`

   **Using YAML:**

   ```yaml
   resources:
     - url: /local/homeassistant-area-card-custom.js
       type: module
   ```

4. **Refresh** your browser (clear cache if necessary)

## About This Project

This is a fork of [LesTR/homeassistant-minimalistic-area-card](https://github.com/LesTR/homeassistant-minimalistic-area-card) (which itself is a fork of [junalmeida/homeassistant-minimalistic-area-card](https://github.com/junalmeida/homeassistant-minimalistic-area-card)). We extend our thanks to the original authors for their foundational work.

## Migration from Previous Versions

If you're upgrading from a previous version of this card:

### Resource URL Update Required

**Important:** The resource URL has changed. After updating via HACS, update your resource configuration:

- **Old URL:** `/hacsfiles/homeassistant-area-card-custom/dist/better-minimalistic-area-card.js`
- **New URL:** `/hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js`

Go to _Settings_ → _Dashboards_ → _⋮ Menu_ → _Resources_ and update the URL for this card.

### Card Type Tags

- **Recommended tag:** `custom:area-overview-card` (primary tag for new configurations)
- **Also supported:** `custom:homeassistant-area-card-custom` (matches the new filename)
- **Legacy tags still work:** `custom:better-minimalistic-area-card` and `custom:minimalistic-area-card` will continue to work
- All configuration options remain the same across all tags

## Usage

After installation and adding the resource, you can add the card to your dashboard.

### Basic Example

```yaml
type: custom:area-overview-card
title: Living Room
area: living_room
```

This minimal configuration will automatically display all entities assigned to the "living_room" area in Home Assistant.

### Advanced Example

```yaml
type: custom:area-overview-card
title: Living Room
image: /local/img/living-room.jpg
area: living_room
icon: mdi:sofa
show_area_icon: true
shadow: true
state_color: true
darken_image: true
tap_action:
  action: navigate
  navigation_path: /lovelace/living-room
entities:
  - entity: light.living_room_lamp
  - entity: switch.fireplace_on_off
  - entity: sensor.living_room_temperature
    show_state: true
  - entity: sensor.living_room_humidity
  - entity: binary_sensor.living_room_motion
    state_color: true
  - entity: media_player.living_room_tv
```

### Camera Background Example

```yaml
type: custom:area-overview-card
title: Front Door
camera_image: camera.front_door
camera_view: live
area: entrance
entities:
  - entity: binary_sensor.front_door
    icon: mdi:door
    state_color: true
  - entity: lock.front_door
```

### Mushroom-style Look (Optional)

Enable Mushroom-inspired visuals for a modern, polished appearance with rounded corners, subtle borders, and theme-aware backgrounds. This mode is inspired by the popular [Mushroom cards](https://github.com/piitaya/lovelace-mushroom).

```yaml
type: custom:area-overview-card
title: Bathroom
area: bathroom
mushroom_style: true
```

**What it does:**

- Applies 16px border radius for softer corners (similar to Mushroom cards)
- Adds a subtle border with low opacity for depth
- Sets a theme-aware background color that adapts to your Home Assistant theme
- Adjusts default icon and button sizes to match Mushroom's visual language

**Important:** When `mushroom_style: true`, all your existing `style.*` options still work and take precedence over the Mushroom defaults. This means you can enable Mushroom mode and still customize colors, sizes, and other style properties as needed.

> **Backwards Compatibility Note:** The card tags `custom:homeassistant-area-card-custom`, `custom:better-minimalistic-area-card`, and `custom:minimalistic-area-card` are all supported for existing configurations, though `custom:area-overview-card` is recommended for new setups.

## Configuration Options

### Card Options

| Name               | Type    | Default      | Description                                                                                                                                              |
| ------------------ | ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`             | string  | **Required** | Must be `custom:area-overview-card` (also supports `custom:homeassistant-area-card-custom` and `custom:better-minimalistic-area-card` for compatibility) |
| `title`            | string  | optional     | Card title text                                                                                                                                          |
| `area`             | string  | optional     | Area ID from Home Assistant (auto-populates entities)                                                                                                    |
| `image`            | string  | optional     | Background image URL (e.g., `/local/img/room.jpg`)                                                                                                       |
| `camera_image`     | string  | optional     | Camera entity ID for live background                                                                                                                     |
| `camera_view`      | string  | `auto`       | Camera view mode: `auto` or `live`                                                                                                                       |
| `icon`             | string  | optional     | Override area icon (e.g., `mdi:sofa`)                                                                                                                    |
| `show_area_icon`   | boolean | `false`      | Show area icon in title                                                                                                                                  |
| `shadow`           | boolean | `false`      | Add drop shadow to icons for better contrast                                                                                                             |
| `hide_unavailable` | boolean | `false`      | Hide unavailable entities                                                                                                                                |
| `state_color`      | boolean | `true`       | Enable Home Assistant colors for entity states                                                                                                           |
| `darken_image`     | boolean | `false`      | Reduce background image brightness                                                                                                                       |
| `mushroom_style`   | boolean | `false`      | Apply Mushroom-inspired visuals (rounded corners, subtle border, theme-aware background)                                                                 |
| `force_dialog`     | boolean | `false`      | Force more-info dialog instead of toggle for buttons                                                                                                     |
| `tap_action`       | object  | optional     | Action configuration for card tap (see [Actions](#actions))                                                                                              |
| `entities`         | list    | optional     | List of entities (if omitted, shows all area entities)                                                                                                   |
| `style`            | object  | optional     | Custom styling options (see [Style Options](#style-options))                                                                                             |
| `align`            | object  | optional     | Text alignment options (see [Alignment](#alignment))                                                                                                     |

### Style Options

Configure colors and sizes within the `style:` section:

| Name                  | Type   | Default       | Description                           |
| --------------------- | ------ | ------------- | ------------------------------------- |
| `color`               | string | inherited     | Main text and icon color              |
| `background_color`    | string | `transparent` | Card background color (when no image) |
| `shadow_color`        | string | `grey`        | Shadow color when `shadow: true`      |
| `sensors_color`       | string | inherited     | Color for sensor area                 |
| `sensors_icon_size`   | string | `18px`        | Icon size in sensor area              |
| `sensors_button_size` | string | `32px`        | Clickable area size in sensor area    |
| `buttons_color`       | string | inherited     | Color for button area                 |
| `buttons_icon_size`   | string | `24px`        | Icon size in button area              |
| `buttons_button_size` | string | `48px`        | Clickable area size in button area    |

### Alignment

Configure text alignment within the `align:` section:

| Name             | Type   | Default | Options                   |
| ---------------- | ------ | ------- | ------------------------- |
| `title`          | string | `left`  | `left`, `center`, `right` |
| `sensors`        | string | `left`  | `left`, `center`, `right` |
| `buttons`        | string | `right` | `left`, `center`, `right` |
| `title_entities` | string | `right` | `left`, `right`           |

### Actions

Card-level and entity-level actions follow the standard [Home Assistant tap_action format](https://www.home-assistant.io/dashboards/actions/):

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/living-room
```

Available actions: `more-info`, `toggle`, `call-service`, `navigate`, `url`, `none`

### Entity Options

Each entity in the `entities` list supports:

| Name                  | Type    | Default      | Description                                                           |
| --------------------- | ------- | ------------ | --------------------------------------------------------------------- |
| `entity`              | string  | **Required** | Entity ID                                                             |
| `hide`                | boolean | `false`      | Hide this entity                                                      |
| `hide_unavailable`    | boolean | `false`      | Hide when unavailable                                                 |
| `show_state`          | boolean | `true`       | Show state text for sensors                                           |
| `state_color`         | boolean | inherited    | Enable state-based coloring                                           |
| `force_dialog`        | boolean | `false`      | Force more-info dialog for this entity                                |
| `section`             | string  | `auto`       | Placement: `auto`, `sensors`, `buttons`, `title`                      |
| `title`               | string  | optional     | Override entity display name                                          |
| `icon`                | string  | optional     | Override entity icon                                                  |
| `color`               | string  | optional     | Custom color for this entity                                          |
| `unit_of_measurement` | string  | optional     | Override unit of measurement                                          |
| `tap_action`          | object  | optional     | Custom tap action for this entity                                     |
| `state`               | list    | optional     | State-based overrides (see [State Overrides](#state-based-overrides)) |

For additional entity options, see the [Home Assistant entities documentation](https://www.home-assistant.io/dashboards/entities/#options-for-entities).

## State Based Overrides

You can configure dynamic styling based on entity state values. This is useful for changing icons or colors based on conditions.

### Configuration

```yaml
entities:
  - entity: binary_sensor.main_door
    icon: mdi:door
    state_color: true
    state:
      - value: 'on'
        operator: '==' # optional, default is '=='
        color: green
        icon: mdi:door-open
        hide: false
      - value: 'off'
        color: red
        icon: mdi:door-closed
```

### State Operators

The order of elements in the `state` array matters - the first match wins. Operators are borrowed from [button-card](https://github.com/custom-cards/button-card).

| Operator   | Example Value  | Description                                      |
| ---------- | -------------- | ------------------------------------------------ |
| `<`        | `5`            | Current state is less than value                 |
| `<=`       | `4`            | Current state is less than or equal to value     |
| `==`       | `42` or `'on'` | **Default operator**. Current state equals value |
| `>=`       | `32`           | Current state is greater than or equal to value  |
| `>`        | `12`           | Current state is greater than value              |
| `!=`       | `'normal'`     | Current state is not equal to value              |
| `regex`    | `'^norm.*$'`   | Value regex applied to current state matches     |
| `template` | (see below)    | JavaScript expression that returns boolean       |
| `default`  | N/A            | Fallback if nothing else matches                 |

### State Override Options

| Name               | Type          | Default      | Description                             |
| ------------------ | ------------- | ------------ | --------------------------------------- |
| `value`            | string/number | **Required** | State value to match                    |
| `operator`         | string        | `==`         | Comparison operator (see table above)   |
| `icon`             | string        | optional     | Icon to use when state matches          |
| `color`            | string        | optional     | Color to use when state matches         |
| `hide`             | boolean       | `false`      | Hide entity when state matches          |
| `hide_unavailable` | boolean       | `false`      | Hide when unavailable and state matches |

## Experimental Templating Support

You can use JavaScript templates for dynamic values based on entity state or attributes. Templates are evaluated within `${}`.

### Template Examples

```yaml
entities:
  # Hide entity based on another entity's state
  - entity: climate.bedroom_thermostat
    hide: ${hass.states['input_boolean.heating_season'].state === 'off'}

  # Hide binary sensor when it's off
  - entity: binary_sensor.washing_machine_leak
    hide: ${state == "off"}

  # Conditional icon based on battery level
  - entity: sensor.phone_battery
    icon: ${state < 20 ? 'mdi:battery-low' : 'mdi:battery'}
```

### Template Variables

The following variables are available within templates:

| Variable  | Type            | Description                                                  |
| --------- | --------------- | ------------------------------------------------------------ |
| `hass`    | `HomeAssistant` | Home Assistant object with full state access                 |
| `state`   | `any`           | Current state value of the entity (or `null`)                |
| `user`    | `CurrentUser`   | Currently logged-in user information                         |
| `helpers` | `object`        | Helper functions (see [Template Helpers](#template-helpers)) |

### Template Helpers

Helper functions for common template operations. See `test/utils.test.ts` for detailed examples.

| Helper                                | Example                                               | Description                                                                                |
| ------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `helpers.states(entity_id)`           | `${helpers.states('binary_sensor.night')}`            | Returns state string of entity, `unknown` if doesn't exist, `unavailable` if not available |
| `helpers.state_attr(entity_id, attr)` | `${helpers.state_attr('switch.light', 'brightness')}` | Returns attribute value or `null` if doesn't exist                                         |
| `helpers.is_state(entity_id, state)`  | `${helpers.is_state('switch.light', 'off')}`          | Tests if entity matches state or any state in list. Returns boolean                        |
| `helpers.is_state_attr(attr, value)`  | `${helpers.is_state_attr('brightness', ['10','20'])}` | Tests if attribute matches value or any value in list                                      |
| `helpers.has_value(entity_id)`        | `${helpers.has_value('switch.light')}`                | Tests if entity is not `unknown` or `unavailable`                                          |

### Template Example in State Overrides

```yaml
entities:
  - entity: sensor.temperature
    state:
      - operator: template
        value: ${state > 25} # Returns boolean
        color: red
        icon: mdi:thermometer-alert
      - operator: default
        color: blue
        icon: mdi:thermometer
```

## CSS Variables

For advanced theming, you can override these CSS variables in your Home Assistant theme:

- `--ha-better-minimalistic-area-card-color` - Main color for text, sensors, buttons and state values
- `--ha-better-minimalistic-area-card-sensors-color` - Color for sensors and state values in the sensors area
- `--ha-better-minimalistic-area-card-sensors-icon-size` - Icon size in sensors area (default: 18px)
- `--ha-better-minimalistic-area-card-sensors-button-size` - Clickable area size in sensors area (default: 32px)
- `--ha-better-minimalistic-area-card-buttons-icon-size` - Icon size in buttons area (default: 24px)
- `--ha-better-minimalistic-area-card-buttons-button-size` - Clickable area size in buttons area (default: 48px)
- `--ha-better-minimalistic-area-card-buttons-color` - Color for buttons and state values in the buttons area
- `--ha-better-minimalistic-area-card-shadow-color` - Shadow color when shadow is enabled

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/phdindota/homeassistant-area-card-custom.git
cd homeassistant-area-card-custom

# Install dependencies
yarn install
# or
npm install
```

### Building

```bash
# Build the card (output goes to dist/)
yarn run build
# or
npm run build

# For development with auto-rebuild and local server
yarn start
# or
npm start
```

The build process:

- Compiles TypeScript source files from `src/`
- Bundles all dependencies
- Outputs the final JavaScript file to `dist/homeassistant-area-card-custom.js`

### Testing

```bash
# Run tests
yarn test
# or
npm test

# Run tests with coverage
yarn coverage
# or
npm run coverage
```

### Linting

```bash
# Check code style
yarn lint
# or
npm run lint
```

### Development Server

When running `yarn start`, the card is served at `http://localhost:6001/homeassistant-area-card-custom.js`. You can configure Home Assistant to load the card from this URL during development:

```yaml
resources:
  - url: http://localhost:6001/homeassistant-area-card-custom.js
    type: module
```

## HACS Configuration

This repository is configured for HACS distribution with the following settings in `hacs.json`:

```json
{
  "name": "Area Overview Card",
  "category": "plugin",
  "render_readme": true,
  "filename": "dist/homeassistant-area-card-custom.js"
}
```

- **name**: "Area Overview Card" - The display name shown in HACS
- **category**: `"plugin"` - Indicates this is a Lovelace custom card (frontend plugin)
- **filename**: Points to the built JavaScript bundle in the `dist/` directory
- **render_readme**: Displays this README in HACS

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

This is a fork of [LesTR/homeassistant-minimalistic-area-card](https://github.com/LesTR/homeassistant-minimalistic-area-card), which itself is a fork of [junalmeida/homeassistant-minimalistic-area-card](https://github.com/junalmeida/homeassistant-minimalistic-area-card). Thanks to all contributors!

## Support

- 🐛 [Report a bug](https://github.com/phdindota/homeassistant-area-card-custom/issues)
- 💡 [Request a feature](https://github.com/phdindota/homeassistant-area-card-custom/issues)
- 📖 [Read the documentation](https://github.com/phdindota/homeassistant-area-card-custom)

<!-- Badges -->

[license-shield]: https://img.shields.io/github/license/phdindota/homeassistant-area-card-custom.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/phdindota/homeassistant-area-card-custom.svg?style=for-the-badge
[releases]: https://github.com/phdindota/homeassistant-area-card-custom/releases

<!-- References -->

[hacs]: https://hacs.xyz
[release-url]: https://github.com/phdindota/homeassistant-area-card-custom/releases
