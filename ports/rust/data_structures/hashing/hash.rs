pub fn fnv1a(input: &str, seed: u32) -> u32 {
    input.encode_utf16().fold(seed, |hash, unit| {
        (hash ^ unit as u32).wrapping_mul(0x01000193)
    })
}
pub fn default_hasher<T: std::fmt::Display>(key: &T) -> u32 {
    let name = std::any::type_name::<T>();
    let kind = if name == "bool" {
        "boolean"
    } else if name == "alloc::string::String" || name == "&str" || name == "str" {
        "string"
    } else if matches!(
        name,
        "i8" | "i16"
            | "i32"
            | "i64"
            | "i128"
            | "isize"
            | "u8"
            | "u16"
            | "u32"
            | "u64"
            | "u128"
            | "usize"
            | "f32"
            | "f64"
    ) {
        "number"
    } else {
        "object"
    };
    fnv1a(&format!("{kind}:{key}"), 0x811c9dc5)
}
