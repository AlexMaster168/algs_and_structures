export const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0)
        [a, b] = [b, a % b];
    return a;
};
export const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs((a / gcd(a, b)) * b));
export const extendedGcd = (a, b) => {
    if (b === 0)
        return { gcd: a, x: 1, y: 0 };
    const { gcd: g, x, y } = extendedGcd(b, a % b);
    return { gcd: g, x: y, y: x - Math.floor(a / b) * y };
};
export const modInverse = (a, m) => {
    const { gcd: g, x } = extendedGcd(((a % m) + m) % m, m);
    return g === 1 ? ((x % m) + m) % m : null;
};
