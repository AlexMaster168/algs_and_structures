package creational

type Button interface{ Render(string) string }
type Checkbox interface{ Render(bool) string }
type ThemeFactory interface {
	CreateButton() Button
	CreateCheckbox() Checkbox
}
type themeButton string

func (b themeButton) Render(label string) string { return "[" + string(b) + " button: " + label + "]" }

type themeCheckbox string

func (c themeCheckbox) Render(checked bool) string {
	mark := " "
	if checked {
		mark = "x"
	}
	return "[" + string(c) + " " + mark + "]"
}

type LightThemeFactory struct{}

func (LightThemeFactory) CreateButton() Button     { return themeButton("light") }
func (LightThemeFactory) CreateCheckbox() Checkbox { return themeCheckbox("light") }

type DarkThemeFactory struct{}

func (DarkThemeFactory) CreateButton() Button     { return themeButton("dark") }
func (DarkThemeFactory) CreateCheckbox() Checkbox { return themeCheckbox("dark") }
func RenderSettingsForm(factory ThemeFactory) []string {
	return []string{factory.CreateCheckbox().Render(true), factory.CreateButton().Render("Save")}
}
