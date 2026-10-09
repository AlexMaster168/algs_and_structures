use std::collections::HashMap;
use std::rc::Rc;
pub struct TreeType {
    pub name: String,
    pub color: String,
    pub texture: String,
}
impl TreeType {
    pub fn draw(&self, x: f64, y: f64) -> String {
        format!("{}({}) at {x},{y}", self.name, self.color)
    }
}
#[derive(Default)]
pub struct TreeTypeFactory {
    types: HashMap<(String, String, String), Rc<TreeType>>,
}
impl TreeTypeFactory {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn count(&self) -> usize {
        self.types.len()
    }
    pub fn get(&mut self, name: String, color: String, texture: String) -> Rc<TreeType> {
        let key = (name.clone(), color.clone(), texture.clone());
        self.types
            .entry(key)
            .or_insert_with(|| {
                Rc::new(TreeType {
                    name,
                    color,
                    texture,
                })
            })
            .clone()
    }
}
struct Tree {
    x: f64,
    y: f64,
    kind: Rc<TreeType>,
}
#[derive(Default)]
pub struct Forest {
    trees: Vec<Tree>,
    factory: TreeTypeFactory,
}
impl Forest {
    pub fn new(factory: TreeTypeFactory) -> Self {
        Self {
            trees: Vec::new(),
            factory,
        }
    }
    pub fn tree_count(&self) -> usize {
        self.trees.len()
    }
    pub fn type_count(&self) -> usize {
        self.factory.count()
    }
    pub fn plant(
        &mut self,
        x: f64,
        y: f64,
        name: String,
        color: String,
        texture: String,
    ) -> &mut Self {
        self.trees.push(Tree {
            x,
            y,
            kind: self.factory.get(name, color, texture),
        });
        self
    }
    pub fn draw(&self) -> Vec<String> {
        self.trees
            .iter()
            .map(|tree| tree.kind.draw(tree.x, tree.y))
            .collect()
    }
}
