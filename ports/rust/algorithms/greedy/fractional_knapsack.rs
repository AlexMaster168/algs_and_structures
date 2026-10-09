pub struct FractionalItem {
    pub weight: f64,
    pub value: f64,
}
pub fn fractional_knapsack(items: &[FractionalItem], mut capacity: f64) -> f64 {
    let mut order: Vec<_> = items.iter().collect();
    order.sort_by(|a, b| (b.value / b.weight).total_cmp(&(a.value / a.weight)));
    let mut value = 0.0;
    for item in order {
        if capacity <= 0.0 {
            break;
        }
        let taken = capacity.min(item.weight);
        value += item.value / item.weight * taken;
        capacity -= taken;
    }
    value
}
