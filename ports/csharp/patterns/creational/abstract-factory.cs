namespace Patterns.Creational;

public interface IButton { string Render(string label); }
public interface ICheckbox { string Render(bool value); }
public interface IThemeFactory { IButton CreateButton(); ICheckbox CreateCheckbox(); }
internal sealed class ThemeButton(string theme) : IButton { public string Render(string label) => $"[{theme} button: {label}]"; }
internal sealed class ThemeCheckbox(string theme) : ICheckbox { public string Render(bool value) => $"[{theme} {(value ? "x" : " ")}]"; }
public sealed class LightThemeFactory : IThemeFactory
{
    public IButton CreateButton() => new ThemeButton("light");
    public ICheckbox CreateCheckbox() => new ThemeCheckbox("light");
}
public sealed class DarkThemeFactory : IThemeFactory
{
    public IButton CreateButton() => new ThemeButton("dark");
    public ICheckbox CreateCheckbox() => new ThemeCheckbox("dark");
}
public static class SettingsForm
{
    public static string[] RenderSettingsForm(IThemeFactory factory) => [factory.CreateCheckbox().Render(true), factory.CreateButton().Render("Save")];
}
