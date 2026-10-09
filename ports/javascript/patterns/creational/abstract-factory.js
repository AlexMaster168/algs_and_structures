class LightButton {
    render(label) {
        return `[light button: ${label}]`;
    }
}
class LightCheckbox {
    render(checked) {
        return checked ? '[light x]' : '[light  ]';
    }
}
class DarkButton {
    render(label) {
        return `[dark button: ${label}]`;
    }
}
class DarkCheckbox {
    render(checked) {
        return checked ? '[dark x]' : '[dark  ]';
    }
}
export class LightThemeFactory {
    createButton() {
        return new LightButton();
    }
    createCheckbox() {
        return new LightCheckbox();
    }
}
export class DarkThemeFactory {
    createButton() {
        return new DarkButton();
    }
    createCheckbox() {
        return new DarkCheckbox();
    }
}
export const renderSettingsForm = (factory) => [
    factory.createCheckbox().render(true),
    factory.createButton().render('Save'),
];
