pub trait ShapeVisitor<R> {
    fn visit_circle(&self, shape: &CircleShape) -> R;
    fn visit_rectangle(&self, shape: &RectangleShape) -> R;
    fn visit_triangle(&self, shape: &TriangleShape) -> R;
}
pub trait VisitableShape {
    fn accept<R>(&self, visitor: &impl ShapeVisitor<R>) -> R;
}
pub struct CircleShape {
    pub radius: f64,
}
pub struct RectangleShape {
    pub width: f64,
    pub height: f64,
}
pub struct TriangleShape {
    pub a: f64,
    pub b: f64,
    pub c: f64,
}
impl VisitableShape for CircleShape {
    fn accept<R>(&self, visitor: &impl ShapeVisitor<R>) -> R {
        visitor.visit_circle(self)
    }
}
impl VisitableShape for RectangleShape {
    fn accept<R>(&self, visitor: &impl ShapeVisitor<R>) -> R {
        visitor.visit_rectangle(self)
    }
}
impl VisitableShape for TriangleShape {
    fn accept<R>(&self, visitor: &impl ShapeVisitor<R>) -> R {
        visitor.visit_triangle(self)
    }
}
pub struct AreaVisitor;
impl ShapeVisitor<f64> for AreaVisitor {
    fn visit_circle(&self, s: &CircleShape) -> f64 {
        std::f64::consts::PI * s.radius * s.radius
    }
    fn visit_rectangle(&self, s: &RectangleShape) -> f64 {
        s.width * s.height
    }
    fn visit_triangle(&self, t: &TriangleShape) -> f64 {
        let s = (t.a + t.b + t.c) / 2.0;
        (s * (s - t.a) * (s - t.b) * (s - t.c)).sqrt()
    }
}
pub struct PerimeterVisitor;
impl ShapeVisitor<f64> for PerimeterVisitor {
    fn visit_circle(&self, s: &CircleShape) -> f64 {
        2.0 * std::f64::consts::PI * s.radius
    }
    fn visit_rectangle(&self, s: &RectangleShape) -> f64 {
        2.0 * (s.width + s.height)
    }
    fn visit_triangle(&self, s: &TriangleShape) -> f64 {
        s.a + s.b + s.c
    }
}
pub struct JsonExportVisitor;
impl ShapeVisitor<String> for JsonExportVisitor {
    fn visit_circle(&self, s: &CircleShape) -> String {
        format!(
            "{{\"type\":\"circle\",\"radius\":{}}}",
            serde_json::json!(s.radius)
        )
    }
    fn visit_rectangle(&self, s: &RectangleShape) -> String {
        format!(
            "{{\"type\":\"rectangle\",\"width\":{},\"height\":{}}}",
            serde_json::json!(s.width),
            serde_json::json!(s.height)
        )
    }
    fn visit_triangle(&self, s: &TriangleShape) -> String {
        format!(
            "{{\"type\":\"triangle\",\"sides\":{}}}",
            serde_json::json!([s.a, s.b, s.c])
        )
    }
}
