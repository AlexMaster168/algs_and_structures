package patterns.behavioral;
import java.util.*;
import shared.Json;

public final class Visitor {
    public interface ShapeVisitor<R>{R visitCircle(CircleShape shape);R visitRectangle(RectangleShape shape);R visitTriangle(TriangleShape shape);}
    public interface VisitableShape{<R> R accept(ShapeVisitor<R> visitor);}
    public record CircleShape(double radius) implements VisitableShape {public <R> R accept(ShapeVisitor<R> v){return v.visitCircle(this);}}
    public record RectangleShape(double width,double height) implements VisitableShape {public <R> R accept(ShapeVisitor<R> v){return v.visitRectangle(this);}}
    public record TriangleShape(double a,double b,double c) implements VisitableShape {public <R> R accept(ShapeVisitor<R> v){return v.visitTriangle(this);}}
    public static class AreaVisitor implements ShapeVisitor<Double>{public Double visitCircle(CircleShape s){return Math.PI*s.radius()*s.radius();}public Double visitRectangle(RectangleShape s){return s.width()*s.height();}public Double visitTriangle(TriangleShape t){double s=(t.a()+t.b()+t.c())/2;return Math.sqrt(s*(s-t.a())*(s-t.b())*(s-t.c()));}}
    public static class PerimeterVisitor implements ShapeVisitor<Double>{public Double visitCircle(CircleShape s){return 2*Math.PI*s.radius();}public Double visitRectangle(RectangleShape s){return 2*(s.width()+s.height());}public Double visitTriangle(TriangleShape t){return t.a()+t.b()+t.c();}}
    public static class JsonExportVisitor implements ShapeVisitor<String>{public String visitCircle(CircleShape s){return Json.stringify(Map.of("type","circle","radius",s.radius()));}public String visitRectangle(RectangleShape s){return Json.stringify(Map.of("type","rectangle","width",s.width(),"height",s.height()));}public String visitTriangle(TriangleShape s){return Json.stringify(Map.of("type","triangle","sides",List.of(s.a(),s.b(),s.c())));}}
}
