const { Adw, Gio, GObject } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('./ui/prefs.ui').get_uri(),
    InternalChildren: [
        'show_all_slider_switch',
        'only_all_slider_switch',
        'show_value_label_switch',
        'show_display_name_switch',
        'show_osd_switch',
        'button_location_combo_row',
        'hide_system_indicator_row',
        'position_system_menu_row',
        'hide_system_indicator_switch',
        'position_system_menu_spin_button',
        'increase_shortcut_entry',
        'decrease_shortcut_entry',
        'increase_shortcut_button',
        'decrease_shortcut_button',
        'step_keyboard_spin_button',
        'allow_zero_brightness_switch',
        'disable_display_state_check_switch'
    ],
}, class PrefsWidget extends Adw.PreferencesPage {

    _init(params = {}) {
        super._init(params);
        this.settings = ExtensionUtils.getSettings();

        this.settings.bind(
            'show-all-slider',
            this._show_all_slider_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'only-all-slider',
            this._only_all_slider_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-value-label',
            this._show_value_label_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-display-name',
            this._show_display_name_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-osd',
            this._show_osd_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._button_location_combo_row.selected = this.settings.get_int('button-location');

        if (this._button_location_combo_row.selected === 0) {
            this._hide_system_indicator_row.sensitive = false;
            this._position_system_menu_row.sensitive = false;
        }

        this.settings.bind(
            'hide-system-indicator',
            this._hide_system_indicator_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._position_system_menu_spin_button.value = this.settings.get_double('position-system-menu');
        this._step_keyboard_spin_button.value = this.settings.get_double('step-change-keyboard');

        this.settings.bind(
            'allow-zero-brightness',
            this._allow_zero_brightness_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'disable-display-state-check',
            this._disable_display_state_check_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._increase_shortcut_entry.text = this.settings.get_strv('increase-brightness-shortcut')[0];
        this._decrease_shortcut_entry.text = this.settings.get_strv('decrease-brightness-shortcut')[0];

        this._increase_shortcut_button.connect('clicked', widget => {
            this.settings.set_strv('increase-brightness-shortcut', [this._increase_shortcut_entry.text]);
        });

        this._decrease_shortcut_button.connect('clicked', widget => {
            this.settings.set_strv('decrease-brightness-shortcut', [this._decrease_shortcut_entry.text]);
        });
    }

    onButtonLocationChanged() {
        this.settings.set_int('button-location', this._button_location_combo_row.selected);
        if (this._button_location_combo_row.selected === 0) {
            this._hide_system_indicator_row.sensitive = false;
            this._position_system_menu_row.sensitive = false;
        } else {
            this._hide_system_indicator_row.sensitive = true;
            this._position_system_menu_row.sensitive = true;
        }
    }
    onPositionValueChanged() {
        this.settings.set_double('position-system-menu', this._position_system_menu_spin_button.value);
    }
    onStepKeyboardValueChanged() {
        this.settings.set_double('step-change-keyboard', this._step_keyboard_spin_button.value);
    }
}
);

function init() {
    ExtensionUtils.initTranslations();
}

function fillPreferencesWindow(window) {
    window.set_size_request(500, 700);
    window.search_enabled = true;

    window.add(new PrefsWidget());
}
