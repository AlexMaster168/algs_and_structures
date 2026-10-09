class _Button:
    def __init__(self, theme):
        self.theme = theme

    def render(self, label):
        return f'[{self.theme} button: {label}]'


class _Checkbox:
    def __init__(self, theme):
        self.theme = theme

    def render(self, checked):
        return f'[{self.theme} {"x" if checked else " "}]'


class LightThemeFactory:
    def create_button(self):
        return _Button('light')

    def create_checkbox(self):
        return _Checkbox('light')


class DarkThemeFactory:
    def create_button(self):
        return _Button('dark')

    def create_checkbox(self):
        return _Checkbox('dark')


def render_settings_form(factory):
    return [factory.create_checkbox().render(True), factory.create_button().render('Save')]
