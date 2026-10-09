pub trait FileSystemNode {
    fn name(&self) -> &str;
    fn size(&self) -> f64;
    fn render(&self, indent: &str) -> Vec<String>;
}
pub struct FileEntry {
    pub name: String,
    bytes: f64,
}
impl FileEntry {
    pub fn new(name: String, bytes: f64) -> Self {
        Self { name, bytes }
    }
}
impl FileSystemNode for FileEntry {
    fn name(&self) -> &str {
        &self.name
    }
    fn size(&self) -> f64 {
        self.bytes
    }
    fn render(&self, indent: &str) -> Vec<String> {
        vec![format!("{indent}{} ({})", self.name, self.bytes)]
    }
}
pub struct Directory {
    pub name: String,
    children: Vec<Box<dyn FileSystemNode>>,
}
impl Directory {
    pub fn new(name: String) -> Self {
        Self {
            name,
            children: Vec::new(),
        }
    }
    pub fn add(&mut self, nodes: impl IntoIterator<Item = Box<dyn FileSystemNode>>) -> &mut Self {
        self.children.extend(nodes);
        self
    }
    pub fn remove(&mut self, name: &str) -> bool {
        if let Some(index) = self.children.iter().position(|node| node.name() == name) {
            self.children.remove(index);
            true
        } else {
            false
        }
    }
}
impl FileSystemNode for Directory {
    fn name(&self) -> &str {
        &self.name
    }
    fn size(&self) -> f64 {
        self.children.iter().map(|node| node.size()).sum()
    }
    fn render(&self, indent: &str) -> Vec<String> {
        let mut lines = vec![format!("{indent}{}/ ({})", self.name, self.size())];
        for child in &self.children {
            lines.extend(child.render(&format!("{indent}  ")));
        }
        lines
    }
}
