pub struct Node<T> {
    pub value: T,
    pub left: Option<Box<Node<T>>>,
    pub right: Option<Box<Node<T>>>,
    pub height: usize,
    pub red: bool,
}
impl<T> Node<T> {
    pub fn new(value: T) -> Self {
        Self {
            value,
            left: None,
            right: None,
            height: 1,
            red: true,
        }
    }
}
pub type Link<T> = Option<Box<Node<T>>>;
pub struct TreeIter<'a, T> {
    stack: Vec<&'a Node<T>>,
}
impl<'a, T> TreeIter<'a, T> {
    pub fn new(root: Option<&'a Node<T>>) -> Self {
        let mut result = Self { stack: Vec::new() };
        result.descend(root);
        result
    }
    fn descend(&mut self, mut node: Option<&'a Node<T>>) {
        while let Some(current) = node {
            self.stack.push(current);
            node = current.left.as_deref();
        }
    }
}
impl<'a, T> Iterator for TreeIter<'a, T> {
    type Item = &'a T;
    fn next(&mut self) -> Option<Self::Item> {
        let node = self.stack.pop()?;
        self.descend(node.right.as_deref());
        Some(&node.value)
    }
}
