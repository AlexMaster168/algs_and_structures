const BRACKETS = { ')': '(', ']': '[', '}': '{' };
export const isBalanced = (input) => {
    const stack = [];
    for (const char of input) {
        if (char === '(' || char === '[' || char === '{')
            stack.push(char);
        else if (char in BRACKETS && stack.pop() !== BRACKETS[char])
            return false;
    }
    return stack.length === 0;
};
export const isPalindrome = (input) => {
    const normalized = input.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    for (let i = 0, j = normalized.length - 1; i < j; i++, j--) {
        if (normalized[i] !== normalized[j])
            return false;
    }
    return true;
};
export const isAnagram = (a, b) => {
    if (a.length !== b.length)
        return false;
    const counts = new Map();
    for (const char of a)
        counts.set(char, (counts.get(char) ?? 0) + 1);
    for (const char of b) {
        const count = counts.get(char);
        if (!count)
            return false;
        counts.set(char, count - 1);
    }
    return true;
};
export const groupAnagrams = (words) => {
    const groups = new Map();
    for (const word of words) {
        const key = [...word].sort().join('');
        groups.set(key, [...(groups.get(key) ?? []), word]);
    }
    return [...groups.values()];
};
export const runLengthEncode = (input) => input.replace(/(.)\1*/gs, (run, char) => `${run.length}${char}`);
export const runLengthDecode = (input) => input.replace(/(\d+)(.)/gs, (_, count, char) => char.repeat(Number(count)));
export const reverseWords = (input) => input.trim().split(/\s+/).reverse().join(' ');
