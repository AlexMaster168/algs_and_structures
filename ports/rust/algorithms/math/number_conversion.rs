pub fn to_base(value: i64, base: u32) -> String {
    assert!((2..=36).contains(&base));
    if value == 0 {
        return "0".into();
    }
    let digits = b"0123456789abcdefghijklmnopqrstuvwxyz";
    let mut n = value.unsigned_abs();
    let mut result = Vec::new();
    while n > 0 {
        result.push(digits[(n % base as u64) as usize]);
        n /= base as u64;
    }
    if value < 0 {
        result.push(b'-');
    }
    result.reverse();
    String::from_utf8(result).unwrap()
}

pub fn from_base(input: &str, base: u32) -> i64 {
    assert!((2..=36).contains(&base));
    i64::from_str_radix(input, base).expect("Invalid digit or out of range")
}

pub fn to_roman(mut value: u32) -> String {
    assert!((1..=3999).contains(&value));
    let mut result = String::new();
    for (amount, symbol) in [
        (1000, "M"),
        (900, "CM"),
        (500, "D"),
        (400, "CD"),
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I"),
    ] {
        while value >= amount {
            result.push_str(symbol);
            value -= amount;
        }
    }
    result
}

pub fn from_roman(input: &str) -> i64 {
    fn value(c: char) -> i64 {
        match c {
            'I' => 1,
            'V' => 5,
            'X' => 10,
            'L' => 50,
            'C' => 100,
            'D' => 500,
            'M' => 1000,
            _ => panic!("Invalid Roman numeral"),
        }
    }
    let chars: Vec<char> = input.chars().collect();
    let mut result = 0;
    for i in 0..chars.len() {
        let current = value(chars[i]);
        let next = chars.get(i + 1).map(|&c| value(c)).unwrap_or(0);
        result += if current < next { -current } else { current };
    }
    result
}
