#pragma once
#include "../../support.hpp"
namespace algs {
struct Button { virtual ~Button() = default; virtual std::string render(const std::string& label) const = 0; };
struct Checkbox { virtual ~Checkbox() = default; virtual std::string render(bool checked) const = 0; };
struct ThemeFactory { virtual ~ThemeFactory() = default; virtual std::unique_ptr<Button> createButton() const = 0; virtual std::unique_ptr<Checkbox> createCheckbox() const = 0; };
class ThemedButton : public Button { std::string theme; public: explicit ThemedButton(std::string theme): theme(std::move(theme)) {} std::string render(const std::string& label) const override { return "[" + theme + " button: " + label + "]"; } };
class ThemedCheckbox : public Checkbox { std::string theme; public: explicit ThemedCheckbox(std::string theme): theme(std::move(theme)) {} std::string render(bool checked) const override { return "[" + theme + (checked ? " x]" : "  ]"); } };
struct LightThemeFactory : ThemeFactory { std::unique_ptr<Button> createButton() const override { return std::make_unique<ThemedButton>("light"); } std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<ThemedCheckbox>("light"); } };
struct DarkThemeFactory : ThemeFactory { std::unique_ptr<Button> createButton() const override { return std::make_unique<ThemedButton>("dark"); } std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<ThemedCheckbox>("dark"); } };
inline std::vector<std::string> renderSettingsForm(const ThemeFactory& factory) { return {factory.createCheckbox()->render(true), factory.createButton()->render("Save")}; }
}
