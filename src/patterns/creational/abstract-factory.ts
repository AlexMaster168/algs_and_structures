export interface Button {
  render(label: string): string;
}

export interface Checkbox {
  render(checked: boolean): string;
}

export interface ThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class LightButton implements Button {
  render(label: string): string {
    return `[light button: ${label}]`;
  }
}

class LightCheckbox implements Checkbox {
  render(checked: boolean): string {
    return checked ? '[light x]' : '[light  ]';
  }
}

class DarkButton implements Button {
  render(label: string): string {
    return `[dark button: ${label}]`;
  }
}

class DarkCheckbox implements Checkbox {
  render(checked: boolean): string {
    return checked ? '[dark x]' : '[dark  ]';
  }
}

export class LightThemeFactory implements ThemeFactory {
  createButton(): Button {
    return new LightButton();
  }

  createCheckbox(): Checkbox {
    return new LightCheckbox();
  }
}

export class DarkThemeFactory implements ThemeFactory {
  createButton(): Button {
    return new DarkButton();
  }

  createCheckbox(): Checkbox {
    return new DarkCheckbox();
  }
}

export const renderSettingsForm = (factory: ThemeFactory): string[] => [
  factory.createCheckbox().render(true),
  factory.createButton().render('Save'),
];
