use std::collections::HashMap;
pub trait Prototype: Clone {
    fn clone_prototype(&self) -> Self {
        self.clone()
    }
}
impl<T: Clone> Prototype for T {}
pub trait Shape {
    fn clone_shape(&self) -> Box<dyn Shape>;
    fn area(&self) -> f64;
    fn tags(&self) -> &[String];
    fn tags_mut(&mut self) -> &mut Vec<String>;
}
impl Clone for Box<dyn Shape> {
    fn clone(&self) -> Self {
        self.clone_shape()
    }
}
#[derive(Clone)]
pub struct Circle {
    pub x: f64,
    pub y: f64,
    pub color: String,
    pub radius: f64,
    pub tags: Vec<String>,
}
impl Shape for Circle {
    fn clone_shape(&self) -> Box<dyn Shape> {
        Box::new(self.clone())
    }
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    fn tags(&self) -> &[String] {
        &self.tags
    }
    fn tags_mut(&mut self) -> &mut Vec<String> {
        &mut self.tags
    }
}
#[derive(Clone)]
pub struct Rectangle {
    pub x: f64,
    pub y: f64,
    pub color: String,
    pub width: f64,
    pub height: f64,
    pub tags: Vec<String>,
}
impl Shape for Rectangle {
    fn clone_shape(&self) -> Box<dyn Shape> {
        Box::new(self.clone())
    }
    fn area(&self) -> f64 {
        self.width * self.height
    }
    fn tags(&self) -> &[String] {
        &self.tags
    }
    fn tags_mut(&mut self) -> &mut Vec<String> {
        &mut self.tags
    }
}
pub struct PrototypeRegistry<T: Prototype> {
    prototypes: HashMap<String, T>,
}
impl<T: Prototype> Default for PrototypeRegistry<T> {
    fn default() -> Self {
        Self {
            prototypes: HashMap::new(),
        }
    }
}
impl<T: Prototype> PrototypeRegistry<T> {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn register(&mut self, key: String, prototype: T) -> &mut Self {
        self.prototypes.insert(key, prototype);
        self
    }
    pub fn create(&self, key: &str) -> Result<T, String> {
        self.prototypes
            .get(key)
            .map(Prototype::clone_prototype)
            .ok_or_else(|| format!("Unknown prototype {key}"))
    }
}
