# Room Presets for Mobile Dashboards

This guide provides ready-to-use configurations for common room types, optimized for mobile viewing with touch-friendly controls and modern aesthetics.

## Table of Contents

- [Mobile Dashboard Best Practices](#mobile-dashboard-best-practices)
- [Room Presets](#room-presets)
  - [Living Room](#living-room)
  - [Bedroom](#bedroom)
  - [Kitchen](#kitchen)
  - [Bathroom](#bathroom)
  - [Home Office](#home-office)
  - [Garage](#garage)
  - [Garden/Outdoor](#gardenoutdoor)
  - [Entrance/Hallway](#entrancehallway)
- [Mobile Optimization Guidelines](#mobile-optimization-guidelines)

---

## Mobile Dashboard Best Practices

When designing cards for mobile dashboards, following these best practices ensures an optimal user experience:

### Touch Target Sizes

- **Primary action buttons**: Minimum 48px × 48px (recommended for toggles, switches, lights)
- **Secondary sensors/indicators**: 32px × 32px (sufficient for read-only information)
- **Spacing between elements**: At least 8px to prevent accidental taps
- **Icon sizes**:
  - Buttons: 24px for clear visibility and touch accuracy
  - Sensors: 18px for efficient space usage while maintaining readability

### Color Contrast and Accessibility

- **State-based coloring** (`state_color: true`): Enables quick visual feedback for entity states
- **Darken background images** (`darken_image: true`): Improves text readability over photos
- **Text shadows** (`shadow: true`): Enhances contrast for text on images
- **High contrast icons**: Ensure icons stand out against backgrounds

### Visual Hierarchy

- **Left alignment for scanning**: Title and sensors on the left for easy reading
- **Right alignment for actions**: Buttons on the right for thumb accessibility
- **Logical grouping**: Separate sensors (monitoring) from buttons (controls)
- **Consistent spacing**: Maintain uniform gaps for visual rhythm

### Icon Usage and Sizing

- **Meaningful icons**: Use icons that clearly represent the function (e.g., `mdi:sofa` for living room)
- **Consistent sizing**: Keep button icons at 24px and sensor icons at 18px
- **State-specific icons**: Change icons based on state (e.g., door open vs. closed)

### Text Readability

- **Shadow on images**: Use `shadow: true` when displaying text over background images
- **Adequate contrast**: Ensure text color contrasts well with background
- **Concise labels**: Keep titles and state text brief for mobile screens

### Loading Performance

- **Optimize images**: Compress background images to reduce load times
- **Limit entities**: Show only essential entities to reduce rendering overhead
- **Use mushroom_style**: The streamlined Mushroom appearance is performance-friendly

### Responsive Behavior

- **Mushroom style** (`mushroom_style: true`): Adapts to theme changes automatically
- **Flexible layouts**: Allow content to reflow on different screen sizes
- **State colors**: Provide instant feedback without requiring text labels

---

## Room Presets

Each preset below includes placeholder entity IDs following Home Assistant naming conventions. Replace these with your actual entity IDs.

### Living Room

Focus on media control, lighting, and climate for comfortable entertainment and relaxation.

```yaml
type: custom:area-overview-card
title: Living Room
area: living_room
icon: mdi:sofa
show_area_icon: true

# Modern mobile-friendly appearance
mushroom_style: true

# Visual enhancements for readability
shadow: true
state_color: true
darken_image: true

# Optional: Add background image for visual appeal
# image: /local/img/living-room.jpg

# Mobile-optimized alignment (left for reading, right for actions)
align:
  title: left
  sensors: left
  buttons: right

# Touch-friendly sizes for mobile
style:
  buttons_icon_size: 24px
  buttons_button_size: 48px  # Minimum touch target for primary controls
  sensors_icon_size: 18px
  sensors_button_size: 32px

# Navigate to detailed room view on tap
tap_action:
  action: navigate
  navigation_path: /lovelace/living-room

entities:
  # Environmental sensors - left side for easy scanning
  - entity: sensor.living_room_temperature
    show_state: true
    section: sensors
  
  - entity: sensor.living_room_humidity
    show_state: true
    section: sensors
  
  - entity: binary_sensor.living_room_motion
    state_color: true
    section: sensors
  
  # Controls - right side for thumb access
  - entity: light.living_room_main
    state_color: true
    section: buttons
  
  - entity: light.living_room_lamp
    state_color: true
    section: buttons
  
  - entity: media_player.living_room_tv
    state_color: true
    section: buttons
    tap_action:
      action: more-info  # Show full media controls
  
  - entity: climate.living_room_thermostat
    state_color: true
    section: buttons
```

**Why these choices?**
- **Mushroom style**: Provides clean, modern look that adapts to themes
- **Shadow on image**: Ensures text remains readable over photos
- **Left/right alignment**: Sensors on left for scanning, buttons on right for thumb reach
- **48px buttons**: Ensures all controls meet minimum touch target size
- **State colors**: Quick visual feedback for on/off states without reading labels

---

### Bedroom

Emphasis on lighting control, climate, and sleep-related sensors for a restful environment.

```yaml
type: custom:area-overview-card
title: Bedroom
area: bedroom
icon: mdi:bed
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/bedroom.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/bedroom

entities:
  # Sleep and comfort monitoring
  - entity: sensor.bedroom_temperature
    show_state: true
    section: sensors
  
  - entity: sensor.bedroom_humidity
    show_state: true
    section: sensors
  
  - entity: binary_sensor.bedroom_motion
    state_color: true
    section: sensors
  
  - entity: binary_sensor.bedroom_window
    state_color: true
    section: sensors
    icon: mdi:window-closed
    state:
      - value: 'on'
        icon: mdi:window-open
        color: orange
      - value: 'off'
        icon: mdi:window-closed
        color: green
  
  # Lighting and climate controls
  - entity: light.bedroom_main
    state_color: true
    section: buttons
  
  - entity: light.bedroom_nightstand
    state_color: true
    section: buttons
  
  - entity: climate.bedroom_thermostat
    state_color: true
    section: buttons
  
  - entity: switch.bedroom_fan
    state_color: true
    section: buttons
```

**Why these choices?**
- **Window sensor with state icons**: Visual indicator shows open vs. closed at a glance
- **Multiple lighting options**: Main light and nightstand for different scenarios
- **Temperature + humidity**: Both important for sleep quality
- **Fan control**: Quick access to adjust airflow for comfort

---

### Kitchen

Appliance monitoring, motion detection, and environmental sensors for a functional kitchen space.

```yaml
type: custom:area-overview-card
title: Kitchen
area: kitchen
icon: mdi:chef-hat
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/kitchen.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/kitchen

entities:
  # Environmental and safety monitoring
  - entity: sensor.kitchen_temperature
    show_state: true
    section: sensors
  
  - entity: binary_sensor.kitchen_motion
    state_color: true
    section: sensors
  
  - entity: binary_sensor.kitchen_water_leak
    state_color: true
    section: sensors
    icon: mdi:water-off
    state:
      - value: 'on'
        icon: mdi:water-alert
        color: red
      - value: 'off'
        icon: mdi:water-off
        color: green
  
  - entity: sensor.dishwasher_status
    show_state: true
    section: sensors
    icon: mdi:dishwasher
  
  - entity: sensor.refrigerator_temperature
    show_state: true
    section: sensors
    icon: mdi:fridge
  
  # Controls
  - entity: light.kitchen_main
    state_color: true
    section: buttons
  
  - entity: light.kitchen_under_cabinet
    state_color: true
    section: buttons
  
  - entity: switch.kitchen_hood_fan
    state_color: true
    section: buttons
    icon: mdi:fan
```

**Why these choices?**
- **Water leak sensor**: Critical safety feature with alert coloring
- **Appliance monitoring**: Track dishwasher and refrigerator status
- **Multiple light zones**: Main and task lighting for different activities
- **Hood fan control**: Quick ventilation access while cooking

---

### Bathroom

Humidity monitoring, temperature control, lighting, and ventilation for comfort and moisture management.

```yaml
type: custom:area-overview-card
title: Bathroom
area: bathroom
icon: mdi:shower
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/bathroom.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/bathroom

entities:
  # Moisture and comfort monitoring
  - entity: sensor.bathroom_temperature
    show_state: true
    section: sensors
  
  - entity: sensor.bathroom_humidity
    show_state: true
    section: sensors
    icon: mdi:water-percent
    state:
      - operator: '>='
        value: 70
        color: orange
        icon: mdi:water-percent-alert
      - operator: 'default'
        color: blue
        icon: mdi:water-percent
  
  - entity: binary_sensor.bathroom_motion
    state_color: true
    section: sensors
  
  - entity: binary_sensor.bathroom_water_leak
    state_color: true
    section: sensors
    icon: mdi:water-off
    state:
      - value: 'on'
        icon: mdi:water-alert
        color: red
      - value: 'off'
        icon: mdi:water-off
        color: green
  
  # Controls
  - entity: light.bathroom_main
    state_color: true
    section: buttons
  
  - entity: light.bathroom_mirror
    state_color: true
    section: buttons
  
  - entity: switch.bathroom_exhaust_fan
    state_color: true
    section: buttons
    icon: mdi:fan
  
  - entity: switch.bathroom_heated_floor
    state_color: true
    section: buttons
    icon: mdi:floor-plan
```

**Why these choices?**
- **Humidity sensor with threshold**: Alerts when humidity is too high (>70%)
- **Exhaust fan**: Essential for moisture control
- **Water leak detection**: Important safety feature
- **Heated floor control**: Comfort feature for colder climates
- **Mirror lighting**: Separate task lighting for grooming

---

### Home Office

Lighting, climate, presence detection, and device monitoring for a productive workspace.

```yaml
type: custom:area-overview-card
title: Home Office
area: home_office
icon: mdi:desk
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/home-office.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/home-office

entities:
  # Environmental and productivity monitoring
  - entity: sensor.office_temperature
    show_state: true
    section: sensors
  
  - entity: sensor.office_humidity
    show_state: true
    section: sensors
  
  - entity: binary_sensor.office_occupancy
    state_color: true
    section: sensors
    icon: mdi:account
  
  - entity: sensor.office_co2
    show_state: true
    section: sensors
    icon: mdi:molecule-co2
    state:
      - operator: '>='
        value: 1000
        color: orange
        icon: mdi:molecule-co2
      - operator: 'default'
        color: green
        icon: mdi:molecule-co2
  
  - entity: binary_sensor.office_window
    state_color: true
    section: sensors
    icon: mdi:window-closed
    state:
      - value: 'on'
        icon: mdi:window-open
      - value: 'off'
        icon: mdi:window-closed
  
  # Controls
  - entity: light.office_main
    state_color: true
    section: buttons
  
  - entity: light.office_desk_lamp
    state_color: true
    section: buttons
  
  - entity: climate.office_thermostat
    state_color: true
    section: buttons
  
  - entity: switch.office_standing_desk
    state_color: true
    section: buttons
    icon: mdi:desk
```

**Why these choices?**
- **CO2 monitoring**: Important for air quality and alertness (threshold at 1000ppm)
- **Occupancy sensor**: Automate lighting and climate
- **Task lighting**: Separate desk lamp for focused work
- **Window sensor**: Helps manage ventilation and temperature
- **Standing desk control**: Modern office ergonomics

---

### Garage

Door sensors, lighting, security, and vehicle monitoring for safety and convenience.

```yaml
type: custom:area-overview-card
title: Garage
area: garage
icon: mdi:garage
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/garage.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/garage

entities:
  # Security and status monitoring
  - entity: cover.garage_door
    state_color: true
    section: sensors
    icon: mdi:garage
    state:
      - value: 'open'
        icon: mdi:garage-open
        color: orange
      - value: 'closed'
        icon: mdi:garage
        color: green
  
  - entity: binary_sensor.garage_door_sensor
    state_color: true
    section: sensors
    icon: mdi:door-closed
    state:
      - value: 'on'
        icon: mdi:door-open
        color: orange
      - value: 'off'
        icon: mdi:door-closed
        color: green
  
  - entity: binary_sensor.garage_motion
    state_color: true
    section: sensors
  
  - entity: sensor.garage_temperature
    show_state: true
    section: sensors
  
  - entity: binary_sensor.car_presence
    state_color: true
    section: sensors
    icon: mdi:car
    state:
      - value: 'on'
        icon: mdi:car
        color: blue
      - value: 'off'
        icon: mdi:car-off
        color: grey
  
  # Controls
  - entity: cover.garage_door
    state_color: true
    section: buttons
    icon: mdi:garage
    tap_action:
      action: toggle
  
  - entity: light.garage_main
    state_color: true
    section: buttons
  
  - entity: switch.garage_workbench_light
    state_color: true
    section: buttons
    icon: mdi:lightbulb
```

**Why these choices?**
- **Garage door sensor + cover**: Monitor status and provide control
- **Vehicle presence**: Know if car is parked (useful for automation)
- **Motion sensor**: Security and automation trigger
- **Multiple light zones**: Main overhead and task lighting
- **State-based door icons**: Clear visual indication of door position

---

### Garden/Outdoor

Weather sensors, irrigation control, outdoor lighting, and environmental monitoring.

```yaml
type: custom:area-overview-card
title: Garden
area: garden
icon: mdi:flower
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/garden.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/garden

entities:
  # Environmental monitoring
  - entity: sensor.outdoor_temperature
    show_state: true
    section: sensors
    icon: mdi:thermometer
  
  - entity: sensor.outdoor_humidity
    show_state: true
    section: sensors
    icon: mdi:water-percent
  
  - entity: sensor.rainfall_today
    show_state: true
    section: sensors
    icon: mdi:weather-rainy
  
  - entity: sensor.soil_moisture
    show_state: true
    section: sensors
    icon: mdi:water
    state:
      - operator: '<'
        value: 30
        color: red
        icon: mdi:water-alert
      - operator: 'default'
        color: green
        icon: mdi:water
  
  - entity: sensor.uv_index
    show_state: true
    section: sensors
    icon: mdi:weather-sunny
    state:
      - operator: '>='
        value: 8
        color: red
      - operator: '>='
        value: 6
        color: orange
      - operator: 'default'
        color: green
  
  # Controls
  - entity: switch.garden_lights
    state_color: true
    section: buttons
    icon: mdi:lightbulb-outline
  
  - entity: switch.irrigation_zone_1
    state_color: true
    section: buttons
    icon: mdi:sprinkler
  
  - entity: switch.irrigation_zone_2
    state_color: true
    section: buttons
    icon: mdi:sprinkler-variant
  
  - entity: switch.garden_fountain
    state_color: true
    section: buttons
    icon: mdi:fountain
```

**Why these choices?**
- **Weather sensors**: Temperature, humidity, and rainfall for irrigation decisions
- **Soil moisture**: Critical for plant health with low threshold alert
- **UV index**: Safety information with color-coded severity levels
- **Multiple irrigation zones**: Individual control for different areas
- **Outdoor lighting**: Security and ambiance
- **Fountain control**: Optional water feature management

---

### Entrance/Hallway

Security monitoring, motion detection, lighting, and door sensors for safety and convenience.

```yaml
type: custom:area-overview-card
title: Entrance
area: entrance
icon: mdi:door
show_area_icon: true

mushroom_style: true
shadow: true
state_color: true
darken_image: true

# Optional background
# image: /local/img/entrance.jpg

align:
  title: left
  sensors: left
  buttons: right

style:
  buttons_icon_size: 24px
  buttons_button_size: 48px
  sensors_icon_size: 18px
  sensors_button_size: 32px

tap_action:
  action: navigate
  navigation_path: /lovelace/entrance

entities:
  # Security and status monitoring
  - entity: binary_sensor.front_door
    state_color: true
    section: sensors
    icon: mdi:door-closed
    state:
      - value: 'on'
        icon: mdi:door-open
        color: orange
      - value: 'off'
        icon: mdi:door-closed
        color: green
  
  - entity: lock.front_door
    state_color: true
    section: sensors
    icon: mdi:lock
    state:
      - value: 'unlocked'
        icon: mdi:lock-open
        color: red
      - value: 'locked'
        icon: mdi:lock
        color: green
  
  - entity: binary_sensor.entrance_motion
    state_color: true
    section: sensors
  
  - entity: binary_sensor.doorbell
    state_color: true
    section: sensors
    icon: mdi:doorbell
  
  - entity: sensor.entrance_temperature
    show_state: true
    section: sensors
  
  # Controls
  - entity: lock.front_door
    state_color: true
    section: buttons
    tap_action:
      action: more-info  # Show lock controls for security
  
  - entity: light.entrance_main
    state_color: true
    section: buttons
  
  - entity: light.porch_light
    state_color: true
    section: buttons
  
  - entity: switch.entrance_camera
    state_color: true
    section: buttons
    icon: mdi:cctv
```

**Why these choices?**
- **Door + lock sensors**: Critical security monitoring with state-based colors
- **Doorbell sensor**: Know when someone's at the door
- **Motion sensor**: Security and automation trigger
- **Lock control**: More-info action for security (prevents accidental unlocks)
- **Multiple lighting**: Interior and exterior for safety
- **Camera control**: Quick access to security monitoring

---

## Mobile Optimization Guidelines

### Recommended Settings for Mobile

These settings ensure the best mobile experience across all room types:

```yaml
# Essential mobile optimizations
mushroom_style: true      # Modern, theme-aware appearance
shadow: true              # Text readability over images
state_color: true         # Quick visual status feedback
darken_image: true        # Better contrast for text

# Ergonomic alignment for mobile
align:
  title: left             # Easy to read
  sensors: left           # Scanning from left to right
  buttons: right          # Thumb-friendly position

# Touch-optimized sizes
style:
  buttons_icon_size: 24px        # Clear, tappable icons
  buttons_button_size: 48px      # Meets minimum touch target
  sensors_icon_size: 18px        # Efficient use of space
  sensors_button_size: 32px      # Adequate for read-only items
```

### Button Size Recommendations

| Element Type       | Purpose         | Recommended Size | Minimum Size | Why                                    |
| ------------------ | --------------- | ---------------- | ------------ | -------------------------------------- |
| Control buttons    | Toggle, switch  | 48px             | 44px         | Primary touch targets need to be large |
| Sensor indicators  | Read-only info  | 32px             | 28px         | Less precision needed for reading      |
| Button icons       | Visual clarity  | 24px             | 20px         | Balance between size and space         |
| Sensor icons       | Information     | 18px             | 16px         | Efficient while remaining readable     |

### Icon Size Recommendations

- **Buttons area**: 24px icons provide clear visibility without overwhelming the interface
- **Sensors area**: 18px icons allow more information density while maintaining readability
- **Consistency**: Use the same sizes across all cards for visual harmony

### Image Background Best Practices

When using background images on mobile:

```yaml
# Enable image optimizations
darken_image: true    # Reduces brightness by ~40% for better text contrast
shadow: true          # Adds text shadow for readability

# Optional: Use lower resolution images for mobile
image: /local/img/room-mobile.jpg  # Optimized for mobile screens
```

**Image optimization tips:**
- Compress images to 200-400KB for faster loading
- Use WebP format when possible for better compression
- Recommended resolution: 800×600px for mobile dashboards
- Ensure key UI elements remain visible over the image

### Strategic Shadow Usage

The `shadow: true` option adds a subtle drop shadow to text and icons, significantly improving readability over images:

- **When to use**: Always enable when using background images
- **When to skip**: Can disable on solid color backgrounds for cleaner look
- **Accessibility**: Improves contrast ratio for better accessibility
- **Performance**: Minimal impact on rendering performance

### State Color Usage

State-based coloring provides instant visual feedback:

```yaml
# Global setting affects all entities
state_color: true

# Per-entity override
entities:
  - entity: light.bedroom_main
    state_color: true    # Uses Home Assistant state colors
  
  - entity: binary_sensor.front_door
    state_color: true
    state:
      - value: 'on'
        color: red       # Custom color for specific state
```

**Color guidelines:**
- **Green**: Good/safe states (closed, locked, normal)
- **Red**: Alert states (open doors, leaks, high thresholds)
- **Orange**: Warning states (high humidity, moderate alerts)
- **Blue**: Active states (media playing, systems on)
- **Grey**: Inactive/off states

### Alignment for Mobile Ergonomics

Left-handed and right-handed users benefit from this alignment strategy:

```yaml
align:
  title: left      # Title on left for natural reading flow
  sensors: left    # Sensor values on left for easy scanning
  buttons: right   # Controls on right for thumb reach
```

**Why this works:**
- Most users hold phones in their right hand
- Thumb naturally reaches the right side of the screen
- Reading flows left to right, so info on left is scanned first
- Actions on right separate "view" from "control" spatially

### Loading Performance Considerations

To ensure fast loading on mobile:

1. **Limit entities**: Show only 6-10 most important entities per card
2. **Optimize images**: Compress and resize background images
3. **Use mushroom_style**: Lightweight rendering with CSS
4. **Avoid excessive state overrides**: Complex state logic increases processing
5. **Cache camera images**: Use `camera_view: auto` instead of `live` when possible

### Responsive Behavior

The card automatically adapts to different screen sizes:

- **Mushroom style**: Adjusts to theme changes (dark/light mode)
- **Flexible icons**: Scale appropriately with button sizes
- **Text wrapping**: Long entity names wrap gracefully
- **State values**: Adjust positioning based on available space

---

## Tips for Customization

### Starting from a Preset

1. **Copy the preset** that matches your room type
2. **Replace entity IDs** with your actual entities
3. **Remove unused entities** to keep the card clean
4. **Test on mobile** to verify touch targets work well
5. **Adjust colors** if needed for your theme

### Adding Custom Entity Icons

```yaml
entities:
  - entity: sensor.custom_device
    icon: mdi:custom-icon      # Override default icon
    state_color: true
    section: sensors
```

Browse [Material Design Icons](https://pictogrammers.com/library/mdi/) for icon options.

### Creating State-Based Variations

```yaml
entities:
  - entity: sensor.air_quality
    show_state: true
    section: sensors
    icon: mdi:air-filter
    state:
      - operator: '>='
        value: 150
        color: red
        icon: mdi:alert-circle
      - operator: '>='
        value: 50
        color: orange
        icon: mdi:alert
      - operator: 'default'
        color: green
        icon: mdi:air-filter
```

### Combining Multiple Presets

For open-concept spaces, combine elements from multiple presets:

```yaml
# Living/Dining Room Combination
type: custom:area-overview-card
title: Living & Dining
area: living_dining
icon: mdi:sofa
mushroom_style: true
entities:
  # Living room elements
  - entity: light.living_room_main
  - entity: media_player.tv
  
  # Dining room elements
  - entity: light.dining_chandelier
  - entity: sensor.dining_temperature
```

---

## Troubleshooting

### Buttons Too Small on Mobile?

Increase button size:

```yaml
style:
  buttons_button_size: 56px  # Larger touch target
  buttons_icon_size: 28px    # Larger icon for visibility
```

### Text Hard to Read Over Image?

Enable contrast enhancements:

```yaml
darken_image: true  # Reduce image brightness
shadow: true        # Add text shadow
```

Or use a semi-transparent background:

```yaml
style:
  background_color: rgba(0, 0, 0, 0.3)  # Dark overlay
```

### Too Many Entities on Card?

Use sections strategically:

- Move less critical sensors to a detailed room view
- Keep only 3-5 most important controls visible
- Use tap_action to navigate to detailed dashboard

### Entity Not Responding to Taps?

Ensure proper entity domain:

- **Toggleable**: `light.*`, `switch.*`, `cover.*`, `lock.*`
- **Read-only**: `sensor.*`, `binary_sensor.*`
- **Media**: Use `tap_action: more-info` for `media_player.*`

### Card Looks Different on Desktop vs Mobile?

This is expected - optimize for your primary use case:

```yaml
# Mobile-first approach
style:
  buttons_button_size: 48px  # Perfect for mobile, slightly large on desktop
```

Consider creating separate dashboards for mobile and desktop if needed.

---

## Additional Resources

- [Home Assistant Actions Documentation](https://www.home-assistant.io/dashboards/actions/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom) - Inspiration for the mushroom_style
- [Mobile Design Guidelines](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)

---

**Ready to get started?** Pick a preset that matches your room, replace the entity IDs with your own, and paste it into your dashboard. Adjust as needed and enjoy your mobile-optimized area card!
