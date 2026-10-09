pub fn permutations<T: Clone>(items: &[T]) -> Vec<Vec<T>> {
    fn visit<T: Clone>(
        items: &[T],
        used: &mut [bool],
        path: &mut Vec<T>,
        result: &mut Vec<Vec<T>>,
    ) {
        if path.len() == items.len() {
            result.push(path.clone());
            return;
        }
        for i in 0..items.len() {
            if !used[i] {
                used[i] = true;
                path.push(items[i].clone());
                visit(items, used, path, result);
                path.pop();
                used[i] = false;
            }
        }
    }
    let mut result = Vec::new();
    visit(
        items,
        &mut vec![false; items.len()],
        &mut Vec::new(),
        &mut result,
    );
    result
}
pub fn combinations<T: Clone>(items: &[T], size: usize) -> Vec<Vec<T>> {
    fn visit<T: Clone>(
        items: &[T],
        size: usize,
        start: usize,
        path: &mut Vec<T>,
        result: &mut Vec<Vec<T>>,
    ) {
        if path.len() == size {
            result.push(path.clone());
            return;
        }
        for i in start..items.len() {
            path.push(items[i].clone());
            visit(items, size, i + 1, path, result);
            path.pop();
        }
    }
    let mut result = Vec::new();
    visit(items, size, 0, &mut Vec::new(), &mut result);
    result
}
pub fn subsets<T: Clone>(items: &[T]) -> Vec<Vec<T>> {
    let mut result = vec![Vec::new()];
    for item in items {
        let extra: Vec<_> = result
            .iter()
            .map(|subset| {
                let mut next = subset.clone();
                next.push(item.clone());
                next
            })
            .collect();
        result.extend(extra);
    }
    result
}
pub fn combination_sum(candidates: &[i64], target: i64) -> Vec<Vec<i64>> {
    let mut sorted = candidates.to_vec();
    sorted.sort_unstable();
    sorted.dedup();
    assert!(sorted.iter().all(|&value| value > 0));
    fn visit(
        values: &[i64],
        remaining: i64,
        start: usize,
        path: &mut Vec<i64>,
        result: &mut Vec<Vec<i64>>,
    ) {
        if remaining == 0 {
            result.push(path.clone());
            return;
        }
        for i in start..values.len() {
            if values[i] > remaining {
                break;
            }
            path.push(values[i]);
            visit(values, remaining - values[i], i, path, result);
            path.pop();
        }
    }
    let mut result = Vec::new();
    visit(&sorted, target, 0, &mut Vec::new(), &mut result);
    result
}
