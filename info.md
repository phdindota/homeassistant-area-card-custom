# Area Overview Card

A **Home Assistant Lovelace custom card** that displays area information with sensors and controllable entities in a clean, minimalistic design.

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

After installation via HACS, add the following to your Lovelace resources:

```yaml
url: /hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js
type: module
```

Or add it through the UI:
- Settings → Dashboards → Resources → Add Resource
- URL: `/hacsfiles/homeassistant-area-card-custom/dist/homeassistant-area-card-custom.js`
- Resource type: `JavaScript Module`

## Configuration

The card can be configured through the visual editor or via YAML. See the [full documentation](https://github.com/phdindota/homeassistant-area-card-custom#readme) for detailed configuration options.

### Basic Example

```yaml
type: custom:area-card
area: living_room
show_camera: false
```

## Support

For issues, feature requests, or questions, please visit the [GitHub repository](https://github.com/phdindota/homeassistant-area-card-custom).
