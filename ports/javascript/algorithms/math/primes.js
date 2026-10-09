import { modPow } from './power.js';
export const sieveOfEratosthenes = (limit) => {
    if (limit < 2)
        return [];
    const composite = new Uint8Array(limit + 1);
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (composite[i])
            continue;
        primes.push(i);
        for (let j = i * i; j <= limit; j += i)
            composite[j] = 1;
    }
    return primes;
};
export const linearSieve = (limit) => {
    const smallestFactor = new Array(limit + 1).fill(0);
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (smallestFactor[i] === 0) {
            smallestFactor[i] = i;
            primes.push(i);
        }
        for (const p of primes) {
            if (p > smallestFactor[i] || i * p > limit)
                break;
            smallestFactor[i * p] = p;
        }
    }
    return { primes, smallestFactor };
};
export const isPrime = (n) => {
    if (n < 2)
        return false;
    if (n < 4)
        return true;
    if (n % 2 === 0 || n % 3 === 0)
        return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0)
            return false;
    }
    return true;
};
export const millerRabin = (n) => {
    if (n < 2n)
        return false;
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    for (const p of smallPrimes) {
        if (n === p)
            return true;
        if (n % p === 0n)
            return false;
    }
    let d = n - 1n;
    let r = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        r++;
    }
    witness: for (const a of smallPrimes) {
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n)
            continue;
        for (let i = 1; i < r; i++) {
            x = (x * x) % n;
            if (x === n - 1n)
                continue witness;
        }
        return false;
    }
    return true;
};
export const primeFactors = (n) => {
    const factors = new Map();
    const add = (p) => void factors.set(p, (factors.get(p) ?? 0) + 1);
    for (let p = 2; p * p <= n; p++) {
        while (n % p === 0) {
            add(p);
            n /= p;
        }
    }
    if (n > 1)
        add(n);
    return factors;
};
export const divisors = (n) => {
    const small = [];
    const large = [];
    for (let i = 1; i * i <= n; i++) {
        if (n % i !== 0)
            continue;
        small.push(i);
        if (i !== n / i)
            large.push(n / i);
    }
    return [...small, ...large.reverse()];
};
export const eulerPhi = (n) => {
    let result = n;
    for (const p of primeFactors(n).keys())
        result -= result / p;
    return result;
};
