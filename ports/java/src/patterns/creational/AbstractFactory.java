package patterns.creational;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class AbstractFactory {
public interface Button{String render(String label);}public interface Checkbox{String render(boolean checked);}public interface ThemeFactory{Button createButton();Checkbox createCheckbox();}public static class LightThemeFactory implements ThemeFactory{public Button createButton(){return label->"[light button: "+label+"]";}public Checkbox createCheckbox(){return checked->checked?"[light x]":"[light  ]";}}public static class DarkThemeFactory implements ThemeFactory{public Button createButton(){return label->"[dark button: "+label+"]";}public Checkbox createCheckbox(){return checked->checked?"[dark x]":"[dark  ]";}}public static List<String> renderSettingsForm(ThemeFactory f){return List.of(f.createCheckbox().render(true),f.createButton().render("Save"));}
}
