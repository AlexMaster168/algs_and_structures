export const prefixFunction = (pattern) => {
    const pi = new Array(pattern.length).fill(0);
    for (let i = 1; i < pattern.length; i++) {
        let k = pi[i - 1];
        while (k > 0 && pattern[i] !== pattern[k])
            k = pi[k - 1];
        if (pattern[i] === pattern[k])
            k++;
        pi[i] = k;
    }
    return pi;
};
export const kmpSearch = (text, pattern) => {
    if (pattern.length === 0)
        return [];
    const pi = prefixFunction(pattern);
    const matches = [];
    let k = 0;
    for (let i = 0; i < text.length; i++) {
        while (k > 0 && text[i] !== pattern[k])
            k = pi[k - 1];
        if (text[i] === pattern[k])
            k++;
        if (k === pattern.length) {
            matches.push(i - k + 1);
            k = pi[k - 1];
        }
    }
    return matches;
};
