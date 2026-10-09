<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

interface Button { public function render(string $label): string; }
interface Checkbox { public function render(bool $checked): string; }
interface ThemeFactory { public function createButton(): Button; public function createCheckbox(): Checkbox; }
class ThemeButton implements Button { public function __construct(private string $theme) {} public function render(string $label): string { return "[$this->theme button: $label]"; } }
class ThemeCheckbox implements Checkbox { public function __construct(private string $theme) {} public function render(bool $checked): string { return '[' . $this->theme . ($checked ? ' x]' : '  ]'); } }
class LightThemeFactory implements ThemeFactory { public function createButton(): Button { return new ThemeButton('light'); } public function createCheckbox(): Checkbox { return new ThemeCheckbox('light'); } }
class DarkThemeFactory implements ThemeFactory { public function createButton(): Button { return new ThemeButton('dark'); } public function createCheckbox(): Checkbox { return new ThemeCheckbox('dark'); } }
function renderSettingsForm(ThemeFactory $factory): array { return [$factory->createCheckbox()->render(true), $factory->createButton()->render('Save')]; }
