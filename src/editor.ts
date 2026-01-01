import { fireEvent, LovelaceCardConfig, LovelaceCardEditor } from '@dermotduffy/custom-card-helpers';
import { css, html, LitElement, TemplateResult } from 'lit';
import { MinimalisticAreaCardConfig, Alignment, EntitySection, ColorValue, HomeAssistantExt } from './types';
import { customElement, property, query, state } from 'lit/decorators.js';
import { cssToRGB } from './utils';

@customElement('area-overview-card-editor')
export class AreaOverviewCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistantExt;
  @state() private config!: MinimalisticAreaCardConfig;
  @state() private showVisualEditor = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @query('ha-yaml-editor') _yamlEditor?: any;

  private yamlChange = false; // true if the change came through the yaml editor

  setConfig(config: LovelaceCardConfig): void {
    this.config = config;
    if (!this.yamlChange) {
      // YAML was changed externally, so update the editor
      this._yamlEditor?.setValue(config);
    }
    this.yamlChange = false;
  }

  protected render(): TemplateResult | void {
    if (!this.config) return html`loading...`;

    return html`
      <div class="card-config">
        <div class="editor-toggle">
          <ha-button-toggle-group
            .value=${this.showVisualEditor ? 'visual' : 'yaml'}
            @value-changed=${this._toggleEditorMode}
          >
            <ha-button-toggle value="visual">Visual Editor</ha-button-toggle>
            <ha-button-toggle value="yaml">YAML Editor</ha-button-toggle>
          </ha-button-toggle-group>
        </div>

        ${this.showVisualEditor ? this._renderVisualEditor() : this._renderYAMLEditor()}
      </div>
    `;
  }

  private _renderYAMLEditor(): TemplateResult {
    return html`
      <div class="instructions">
        For instructions, visit the
        <a href="https://github.com/phdindota/homeassistant-area-card-custom" target="_blank"
          >Area Overview Card Examples and Docs</a
        >.
      </div>
      <div class="yaml-editor">
        <ha-yaml-editor
          .defaultValue=${this.config}
          autofocus
          .hass=${this.hass}
          @value-changed=${this._handleYAMLChanged}
          @keydown=${this._ignoreKeydown}
          dir="ltr"
        ></ha-yaml-editor>
      </div>
    `;
  }

  private _renderVisualEditor(): TemplateResult {
    if (!this.hass) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <div class="visual-editor">
        ${this._renderGeneralSettings()} ${this._renderStyleSettings()} ${this._renderAlignmentSettings()}
        ${this._renderActionSettings()} ${this._renderEntitiesSettings()}
      </div>
    `;
  }

  private _renderGeneralSettings(): TemplateResult {
    const areas = this.hass?.areas || {};
    const areaOptions = Object.keys(areas).map((areaId) => ({
      value: areaId,
      label: areas[areaId].name || areaId,
    }));

    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3">
          <ha-icon icon="mdi:cog"></ha-icon>
          General Settings
        </div>
        <div class="content">
          <ha-textfield
            label="Title"
            .value=${this.config.title || ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>

          <ha-textfield
            label="Image URL"
            .value=${this.config.image || ''}
            .configValue=${'image'}
            @input=${this._valueChanged}
            helper-text="URL to background image"
          ></ha-textfield>

          ${areaOptions.length > 0
            ? html`
                <ha-select
                  label="Area"
                  .value=${this.config.area || ''}
                  .configValue=${'area'}
                  @selected=${this._valueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <mwc-list-item value=""></mwc-list-item>
                  ${areaOptions.map(
                    (option) => html` <mwc-list-item .value=${option.value}>${option.label}</mwc-list-item> `,
                  )}
                </ha-select>
              `
            : html`
                <ha-textfield
                  label="Area"
                  .value=${this.config.area || ''}
                  .configValue=${'area'}
                  @input=${this._valueChanged}
                ></ha-textfield>
              `}

          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: { domain: 'camera' } }}
            .value=${this.config.camera_image || ''}
            .label=${'Camera Entity'}
            .configValue=${'camera_image'}
            @value-changed=${this._selectorValueChanged}
          ></ha-selector>

          <ha-select
            label="Camera View"
            .value=${this.config.camera_view || 'auto'}
            .configValue=${'camera_view'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="auto">Auto</mwc-list-item>
            <mwc-list-item value="live">Live</mwc-list-item>
          </ha-select>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ icon: {} }}
            .value=${this.config.icon || ''}
            .label=${'Icon'}
            .configValue=${'icon'}
            @value-changed=${this._selectorValueChanged}
          ></ha-selector>

          <ha-formfield label="Show Area Icon">
            <ha-switch
              .checked=${this.config.show_area_icon || false}
              .configValue=${'show_area_icon'}
              @change=${this._toggleChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Shadow">
            <ha-switch
              .checked=${this.config.shadow || false}
              .configValue=${'shadow'}
              @change=${this._toggleChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Darken Image">
            <ha-switch
              .checked=${this.config.darken_image || false}
              .configValue=${'darken_image'}
              @change=${this._toggleChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Hide Unavailable Entities">
            <ha-switch
              .checked=${this.config.hide_unavailable || false}
              .configValue=${'hide_unavailable'}
              @change=${this._toggleChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="State Color">
            <ha-switch
              .checked=${this.config.state_color !== undefined ? this.config.state_color : true}
              .configValue=${'state_color'}
              @change=${this._toggleChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _renderStyleSettings(): TemplateResult {
    const style = this.config.style || {};

    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3">
          <ha-icon icon="mdi:palette"></ha-icon>
          Style
        </div>
        <div class="content">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ color_rgb: {} }}
            .value=${this._getColorValue(style.color)}
            .label=${'Color (text and icons)'}
            .configValue=${'style.color'}
            @value-changed=${this._colorChanged}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ color_rgb: {} }}
            .value=${this._getColorValue(style.background_color)}
            .label=${'Background Color'}
            .configValue=${'style.background_color'}
            @value-changed=${this._colorChanged}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ color_rgb: {} }}
            .value=${this._getColorValue(style.shadow_color)}
            .label=${'Shadow Color'}
            .configValue=${'style.shadow_color'}
            @value-changed=${this._colorChanged}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ color_rgb: {} }}
            .value=${this._getColorValue(style.sensors_color)}
            .label=${'Sensors Color'}
            .configValue=${'style.sensors_color'}
            @value-changed=${this._colorChanged}
          ></ha-selector>

          <ha-textfield
            label="Sensors Icon Size"
            .value=${style.sensors_icon_size || ''}
            .configValue=${'style.sensors_icon_size'}
            @input=${this._valueChanged}
            helper-text="Default: 18px"
          ></ha-textfield>

          <ha-textfield
            label="Sensors Button Size"
            .value=${style.sensors_button_size || ''}
            .configValue=${'style.sensors_button_size'}
            @input=${this._valueChanged}
            helper-text="Default: 32px"
          ></ha-textfield>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ color_rgb: {} }}
            .value=${this._getColorValue(style.buttons_color)}
            .label=${'Buttons Color'}
            .configValue=${'style.buttons_color'}
            @value-changed=${this._colorChanged}
          ></ha-selector>

          <ha-textfield
            label="Buttons Icon Size"
            .value=${style.buttons_icon_size || ''}
            .configValue=${'style.buttons_icon_size'}
            @input=${this._valueChanged}
            helper-text="Default: 24px"
          ></ha-textfield>

          <ha-textfield
            label="Buttons Button Size"
            .value=${style.buttons_button_size || ''}
            .configValue=${'style.buttons_button_size'}
            @input=${this._valueChanged}
            helper-text="Default: 48px"
          ></ha-textfield>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _renderAlignmentSettings(): TemplateResult {
    const align = this.config.align || {};

    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3">
          <ha-icon icon="mdi:format-align-center"></ha-icon>
          Alignment
        </div>
        <div class="content">
          <ha-select
            label="Title Alignment"
            .value=${align.title || Alignment.left}
            .configValue=${'align.title'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="${Alignment.left}">Left</mwc-list-item>
            <mwc-list-item value="${Alignment.center}">Center</mwc-list-item>
            <mwc-list-item value="${Alignment.right}">Right</mwc-list-item>
          </ha-select>

          <ha-select
            label="Sensors Alignment"
            .value=${align.sensors || Alignment.left}
            .configValue=${'align.sensors'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="${Alignment.left}">Left</mwc-list-item>
            <mwc-list-item value="${Alignment.center}">Center</mwc-list-item>
            <mwc-list-item value="${Alignment.right}">Right</mwc-list-item>
          </ha-select>

          <ha-select
            label="Buttons Alignment"
            .value=${align.buttons || Alignment.right}
            .configValue=${'align.buttons'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="${Alignment.left}">Left</mwc-list-item>
            <mwc-list-item value="${Alignment.center}">Center</mwc-list-item>
            <mwc-list-item value="${Alignment.right}">Right</mwc-list-item>
          </ha-select>

          <ha-select
            label="Title Entities Alignment"
            .value=${align.title_entities || Alignment.right}
            .configValue=${'align.title_entities'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="${Alignment.left}">Left</mwc-list-item>
            <mwc-list-item value="${Alignment.right}">Right</mwc-list-item>
          </ha-select>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _renderActionSettings(): TemplateResult {
    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3">
          <ha-icon icon="mdi:gesture-tap"></ha-icon>
          Actions
        </div>
        <div class="content">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this.config.tap_action || {}}
            .label=${'Tap Action'}
            .configValue=${'tap_action'}
            @value-changed=${this._selectorValueChanged}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this.config.hold_action || {}}
            .label=${'Hold Action'}
            .configValue=${'hold_action'}
            @value-changed=${this._selectorValueChanged}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this.config.double_tap_action || {}}
            .label=${'Double Tap Action'}
            .configValue=${'double_tap_action'}
            @value-changed=${this._selectorValueChanged}
          ></ha-selector>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _renderEntitiesSettings(): TemplateResult {
    const entities = this.config.entities || [];

    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3">
          <ha-icon icon="mdi:shape"></ha-icon>
          Entities
        </div>
        <div class="content">
          <div class="entities-list">${entities.map((entity, index) => this._renderEntityRow(entity, index))}</div>
          <ha-button @click=${this._addEntity}>
            <ha-icon icon="mdi:plus"></ha-icon>
            Add Entity
          </ha-button>
        </div>
      </ha-expansion-panel>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _renderEntityRow(entity: any, index: number): TemplateResult {
    const entityConfig = typeof entity === 'string' ? { entity } : entity;

    return html`
      <div class="entity-row">
        <div class="entity-row-header">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: {} }}
            .value=${entityConfig.entity || ''}
            .label=${'Entity'}
            .configValue=${'entities.' + index + '.entity'}
            @value-changed=${this._entityValueChanged}
          ></ha-selector>
          <ha-icon-button .index=${index} @click=${this._removeEntity} .label=${'Remove'}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        </div>

        ${entityConfig.entity
          ? html`
              <div class="entity-row-details">
                <ha-formfield label="Show State">
                  <ha-switch
                    .checked=${entityConfig.show_state !== undefined ? entityConfig.show_state : true}
                    .configValue=${'entities.' + index + '.show_state'}
                    @change=${this._entityToggleChanged}
                  ></ha-switch>
                </ha-formfield>

                <ha-formfield label="Hide">
                  <ha-switch
                    .checked=${entityConfig.hide || false}
                    .configValue=${'entities.' + index + '.hide'}
                    @change=${this._entityToggleChanged}
                  ></ha-switch>
                </ha-formfield>

                <ha-select
                  label="Section"
                  .value=${entityConfig.section || EntitySection.auto}
                  .configValue=${'entities.' + index + '.section'}
                  @selected=${this._entityValueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <mwc-list-item value="${EntitySection.auto}">Auto</mwc-list-item>
                  <mwc-list-item value="${EntitySection.sensors}">Sensors</mwc-list-item>
                  <mwc-list-item value="${EntitySection.buttons}">Buttons</mwc-list-item>
                  <mwc-list-item value="${EntitySection.title}">Title</mwc-list-item>
                </ha-select>

                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ color_rgb: {} }}
                  .value=${this._getColorValue(entityConfig.color)}
                  .label=${'Color'}
                  .configValue=${'entities.' + index + '.color'}
                  @value-changed=${this._entityColorChanged}
                ></ha-selector>

                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ icon: {} }}
                  .value=${entityConfig.icon || ''}
                  .label=${'Icon'}
                  .configValue=${'entities.' + index + '.icon'}
                  @value-changed=${this._entityValueChanged}
                ></ha-selector>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _getColorValue(color: ColorValue | undefined): { r: number; g: number; b: number } | undefined {
    if (!color) {
      return undefined;
    }

    if (typeof color === 'string') {
      return cssToRGB(color);
    }

    return color;
  }

  private _toggleEditorMode(ev: CustomEvent): void {
    this.showVisualEditor = ev.detail.value === 'visual';
  }

  private _ignoreKeydown(ev: KeyboardEvent) {
    ev.stopPropagation();
  }

  private _handleYAMLChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const config = ev.detail.value;
    if (ev.detail.isValid) {
      this.yamlChange = true;
      this.config = config;
      fireEvent(this, 'config-changed', { config: this.config });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _valueChanged(ev: any): void {
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget to get the element where the listener is attached
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    let value = target.value;

    if (target.type === 'number') {
      value = Number(value);
    }

    if (value === '') {
      value = undefined;
    }

    this._updateConfigValue(configValue, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _toggleChanged(ev: any): void {
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget to get the element where the listener is attached
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    this._updateConfigValue(configValue, target.checked);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _selectorValueChanged(ev: any): void {
    ev.stopPropagation();
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget to get the element where configValue was set
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    const value = ev.detail?.value;
    this._updateConfigValue(configValue, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _colorChanged(ev: any): void {
    ev.stopPropagation();
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget instead of target to get the ha-selector element
    // where we set the configValue property
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    const value = ev.detail?.value;
    // Store as RGB object for visual editor, will be converted to CSS when used
    this._updateConfigValue(configValue, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityValueChanged(ev: any): void {
    ev.stopPropagation();
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget to get the element where configValue was set
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    const value = ev.detail?.value !== undefined ? ev.detail.value : target.value;
    this._updateConfigValue(configValue, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityToggleChanged(ev: any): void {
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget to get the element where the listener is attached
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    this._updateConfigValue(configValue, target.checked);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _entityColorChanged(ev: any): void {
    ev.stopPropagation();
    if (!this.config || !this.hass) {
      return;
    }
    // Use currentTarget instead of target to get the ha-selector element
    // where we set the configValue property
    const target = ev.currentTarget;
    const configValue = target.configValue as string | undefined;

    if (!configValue) {
      return;
    }

    const value = ev.detail?.value;
    this._updateConfigValue(configValue, value);
  }

  private _addEntity(): void {
    const entities = [...(this.config.entities || [])];
    entities.push({ entity: '' });
    this._updateConfigValue('entities', entities);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _removeEntity(ev: any): void {
    const index = ev.currentTarget.index;
    const entities = [...(this.config.entities || [])];
    entities.splice(index, 1);
    this._updateConfigValue('entities', entities);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _updateConfigValue(configPath: string, value: any): void {
    const newConfig = { ...this.config };
    const parts = configPath.split('.');

    // Guard against prototype pollution - check all parts
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const part of parts) {
      if (dangerousKeys.includes(part)) {
        console.error('Attempted to set dangerous property:', configPath);
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newConfig;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      // Handle array indices
      if (part.match(/^\d+$/)) {
        const index = parseInt(part);
        if (!Object.prototype.hasOwnProperty.call(current, index)) {
          current[index] = {};
        }
        current = current[index];
      } else {
        if (!Object.prototype.hasOwnProperty.call(current, part)) {
          // Create a plain object, not one that could affect prototypes
          current[part] = Object.create(null);
          Object.setPrototypeOf(current[part], Object.prototype);
        }
        current = current[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    // Final guard before setting
    if (dangerousKeys.includes(lastPart)) {
      console.error('Attempted to set dangerous property:', configPath);
      return;
    }

    if (value === undefined || value === '') {
      delete current[lastPart];
    } else {
      // Direct assignment is safe here since we've validated the key
      current[lastPart] = value;
    }

    this.config = newConfig;
    fireEvent(this, 'config-changed', { config: this.config });
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .editor-toggle {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .instructions {
      margin-bottom: 8px;
    }

    .instructions a {
      color: var(--mdc-theme-primary, #6200ee);
    }

    .visual-editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    ha-expansion-panel {
      --expansion-panel-summary-padding: 0 16px;
      --expansion-panel-content-padding: 0 16px 16px;
    }

    ha-expansion-panel[outlined] {
      border: 1px solid var(--divider-color);
      border-radius: 4px;
    }

    ha-expansion-panel div[slot='header'] {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
    }

    ha-textfield,
    ha-select {
      width: 100%;
    }

    ha-formfield {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .entities-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .entity-row {
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 16px;
      background: var(--card-background-color);
    }

    .entity-row-header {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .entity-row-header ha-selector {
      flex: 1;
    }

    .entity-row-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color);
    }

    ha-button {
      width: 100%;
    }
  `;
}

// Register backwards-compatible editor aliases
// Using manual registration after decorator to ensure primary tag is registered first
if (!customElements.get('better-minimalistic-area-card-editor')) {
  customElements.define('better-minimalistic-area-card-editor', AreaOverviewCardEditor);
}
if (!customElements.get('minimalistic-area-card-editor')) {
  customElements.define('minimalistic-area-card-editor', AreaOverviewCardEditor);
}
