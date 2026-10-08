export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
};

export const lcm = (a: number, b: number): number => (a === 0 || b === 0 ? 0 : Math.abs((a / gcd(a, b)) * b));

export const extendedGcd = (a: number, b: number): { gcd: number; x: number; y: number } => {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const { gcd: g, x, y } = extendedGcd(b, a % b);
  return { gcd: g, x: y, y: x - Math.floor(a / b) * y };
};

export const modInverse = (a: number, m: number): number | null => {
  const { gcd: g, x } = extendedGcd(((a % m) + m) % m, m);
  return g === 1 ? ((x % m) + m) % m : null;
};
