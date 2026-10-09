pub fn gcd(mut a: i64, mut b: i64) -> i64 {
    a = a.abs();
    b = b.abs();
    while b != 0 {
        let remainder = a % b;
        a = b;
        b = remainder;
    }
    a
}

pub fn lcm(a: i64, b: i64) -> i64 {
    if a == 0 || b == 0 {
        0
    } else {
        ((a / gcd(a, b)) * b).abs()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ExtendedGcd {
    pub gcd: i64,
    pub x: i64,
    pub y: i64,
}

pub fn extended_gcd(a: i64, b: i64) -> ExtendedGcd {
    let (mut old_r, mut r, mut old_s, mut s, mut old_t, mut t) = (a, b, 1, 0, 0, 1);
    while r != 0 {
        let q = old_r / r;
        (old_r, r) = (r, old_r - q * r);
        (old_s, s) = (s, old_s - q * s);
        (old_t, t) = (t, old_t - q * t);
    }
    ExtendedGcd {
        gcd: old_r,
        x: old_s,
        y: old_t,
    }
}

pub fn mod_inverse(a: i64, modulus: i64) -> Option<i64> {
    assert!(modulus > 0);
    let result = extended_gcd(a, modulus);
    if result.gcd != 1 {
        None
    } else {
        Some(result.x.rem_euclid(modulus))
    }
}
