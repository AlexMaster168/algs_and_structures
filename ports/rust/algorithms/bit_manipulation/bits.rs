pub fn get_bit(value: u32, position: u32) -> u32 {
    value >> (position & 31) & 1
}
pub fn set_bit(value: u32, position: u32) -> u32 {
    value | (1 << (position & 31))
}
pub fn clear_bit(value: u32, position: u32) -> u32 {
    value & !(1 << (position & 31))
}
pub fn toggle_bit(value: u32, position: u32) -> u32 {
    value ^ (1 << (position & 31))
}
pub fn count_set_bits(mut value: u32) -> u32 {
    let mut count = 0;
    while value != 0 {
        value &= value - 1;
        count += 1;
    }
    count
}
pub fn is_power_of_two(value: i64) -> bool {
    value > 0 && (value as u32) & (value.wrapping_sub(1) as u32) == 0
}
pub fn lowest_set_bit(value: u32) -> i32 {
    (value & value.wrapping_neg()) as i32
}
pub fn single_number(values: &[i32]) -> i32 {
    values.iter().fold(0, |a, b| a ^ b)
}
pub fn reverse_bits(mut value: u32) -> u32 {
    let mut result = 0;
    for _ in 0..32 {
        result = result << 1 | value & 1;
        value >>= 1;
    }
    result
}
pub fn gray_code(bits: u32) -> Vec<u32> {
    assert!(bits <= 30);
    (0..1u32 << bits).map(|i| i ^ (i >> 1)).collect()
}
pub fn subsets_by_mask<T: Clone>(items: &[T]) -> Vec<Vec<T>> {
    assert!(items.len() <= 30);
    (0..1usize << items.len())
        .map(|mask| {
            items
                .iter()
                .enumerate()
                .filter(|(i, _)| mask & (1 << i) != 0)
                .map(|(_, item)| item.clone())
                .collect()
        })
        .collect()
}
pub fn swap_without_temp(mut a: i32, mut b: i32) -> (i32, i32) {
    a ^= b;
    b ^= a;
    a ^= b;
    (a, b)
}
pub fn hamming_distance(a: u32, b: u32) -> u32 {
    count_set_bits(a ^ b)
}
