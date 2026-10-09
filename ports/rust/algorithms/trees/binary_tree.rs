use std::collections::VecDeque;
#[derive(Clone)]
pub struct TreeNode<T> {
    pub value: T,
    pub left: Option<Box<TreeNode<T>>>,
    pub right: Option<Box<TreeNode<T>>>,
}
pub fn tree_node<T>(
    value: T,
    left: Option<Box<TreeNode<T>>>,
    right: Option<Box<TreeNode<T>>>,
) -> Box<TreeNode<T>> {
    Box::new(TreeNode { value, left, right })
}
pub fn from_level_order<T: Clone>(values: &[Option<T>]) -> Option<Box<TreeNode<T>>> {
    values.first()?.as_ref()?;
    struct Slot<T> {
        value: T,
        left: Option<usize>,
        right: Option<usize>,
    }
    let mut arena = vec![Slot {
        value: values[0].as_ref().unwrap().clone(),
        left: None,
        right: None,
    }];
    let mut i = 1;
    let mut head = 0;
    while head < arena.len() && i < values.len() {
        for side in 0..2 {
            if let Some(Some(value)) = values.get(i) {
                let index = arena.len();
                arena.push(Slot {
                    value: value.clone(),
                    left: None,
                    right: None,
                });
                if side == 0 {
                    arena[head].left = Some(index);
                } else {
                    arena[head].right = Some(index);
                }
            }
            i += 1;
        }
        head += 1;
    }
    fn build<T: Clone>(arena: &[Slot<T>], index: usize) -> Box<TreeNode<T>> {
        let node = &arena[index];
        tree_node(
            node.value.clone(),
            node.left.map(|i| build(arena, i)),
            node.right.map(|i| build(arena, i)),
        )
    }
    Some(build(&arena, 0))
}
pub fn pre_order<T: Clone>(root: Option<&TreeNode<T>>) -> Vec<T> {
    let mut result = Vec::new();
    let mut stack = Vec::new();
    if let Some(root) = root {
        stack.push(root);
    }
    while let Some(node) = stack.pop() {
        result.push(node.value.clone());
        if let Some(right) = node.right.as_deref() {
            stack.push(right);
        }
        if let Some(left) = node.left.as_deref() {
            stack.push(left);
        }
    }
    result
}
pub fn in_order<T: Clone>(mut root: Option<&TreeNode<T>>) -> Vec<T> {
    let mut result = Vec::new();
    let mut stack = Vec::new();
    while root.is_some() || !stack.is_empty() {
        while let Some(node) = root {
            stack.push(node);
            root = node.left.as_deref();
        }
        let node = stack.pop().unwrap();
        result.push(node.value.clone());
        root = node.right.as_deref();
    }
    result
}
pub fn post_order<T: Clone>(root: Option<&TreeNode<T>>) -> Vec<T> {
    let mut result = Vec::new();
    let mut stack = Vec::new();
    if let Some(root) = root {
        stack.push(root);
    }
    while let Some(node) = stack.pop() {
        result.push(node.value.clone());
        if let Some(left) = node.left.as_deref() {
            stack.push(left);
        }
        if let Some(right) = node.right.as_deref() {
            stack.push(right);
        }
    }
    result.reverse();
    result
}
pub fn level_order<T: Clone>(root: Option<&TreeNode<T>>) -> Vec<Vec<T>> {
    let mut levels = Vec::new();
    let mut queue = VecDeque::new();
    if let Some(root) = root {
        queue.push_back(root);
    }
    while !queue.is_empty() {
        let count = queue.len();
        let mut level = Vec::new();
        for _ in 0..count {
            let node = queue.pop_front().unwrap();
            level.push(node.value.clone());
            if let Some(left) = node.left.as_deref() {
                queue.push_back(left);
            }
            if let Some(right) = node.right.as_deref() {
                queue.push_back(right);
            }
        }
        levels.push(level);
    }
    levels
}
pub fn max_depth<T>(root: Option<&TreeNode<T>>) -> usize {
    root.map_or(0, |node| {
        1 + max_depth(node.left.as_deref()).max(max_depth(node.right.as_deref()))
    })
}
pub fn max_value(root: Option<&TreeNode<f64>>) -> Option<f64> {
    pre_order(root).into_iter().reduce(f64::max)
}
pub fn is_valid_bst(root: Option<&TreeNode<f64>>, low: f64, high: f64) -> bool {
    root.is_none_or(|node| {
        node.value > low
            && node.value < high
            && is_valid_bst(node.left.as_deref(), low, node.value)
            && is_valid_bst(node.right.as_deref(), node.value, high)
    })
}
pub fn invert_tree<T>(root: &mut Option<Box<TreeNode<T>>>) {
    if let Some(node) = root {
        std::mem::swap(&mut node.left, &mut node.right);
        invert_tree(&mut node.left);
        invert_tree(&mut node.right);
    }
}
pub fn lowest_common_ancestor_bst(
    mut root: Option<&TreeNode<f64>>,
    a: f64,
    b: f64,
) -> Option<&TreeNode<f64>> {
    while let Some(node) = root {
        if a < node.value && b < node.value {
            root = node.left.as_deref();
        } else if a > node.value && b > node.value {
            root = node.right.as_deref();
        } else {
            return Some(node);
        }
    }
    None
}
