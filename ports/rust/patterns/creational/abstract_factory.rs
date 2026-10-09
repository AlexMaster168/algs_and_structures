pub trait Button {
    fn render(&self, label: &str) -> String;
}
pub trait Checkbox {
    fn render(&self, checked: bool) -> String;
}
pub trait ThemeFactory {
    fn create_button(&self) -> Box<dyn Button>;
    fn create_checkbox(&self) -> Box<dyn Checkbox>;
}
struct ThemedButton(&'static str);
struct ThemedCheckbox(&'static str);
impl Button for ThemedButton {
    fn render(&self, label: &str) -> String {
        format!("[{} button: {label}]", self.0)
    }
}
impl Checkbox for ThemedCheckbox {
    fn render(&self, checked: bool) -> String {
        format!("[{} {}]", self.0, if checked { "x" } else { " " })
    }
}
pub struct LightThemeFactory;
pub struct DarkThemeFactory;
impl ThemeFactory for LightThemeFactory {
    fn create_button(&self) -> Box<dyn Button> {
        Box::new(ThemedButton("light"))
    }
    fn create_checkbox(&self) -> Box<dyn Checkbox> {
        Box::new(ThemedCheckbox("light"))
    }
}
impl ThemeFactory for DarkThemeFactory {
    fn create_button(&self) -> Box<dyn Button> {
        Box::new(ThemedButton("dark"))
    }
    fn create_checkbox(&self) -> Box<dyn Checkbox> {
        Box::new(ThemedCheckbox("dark"))
    }
}
pub fn render_settings_form(factory: &dyn ThemeFactory) -> Vec<String> {
    vec![
        factory.create_checkbox().render(true),
        factory.create_button().render("Save"),
    ]
}
