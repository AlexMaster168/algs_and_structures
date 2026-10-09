export const longestCommonSubsequence = (a, b) => {
    const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            table[i][j] =
                a[i - 1] === b[j - 1] ? table[i - 1][j - 1] + 1 : Math.max(table[i - 1][j], table[i][j - 1]);
        }
    }
    const result = [];
    for (let i = a.length, j = b.length; i > 0 && j > 0;) {
        if (a[i - 1] === b[j - 1]) {
            result.push(a[i - 1]);
            i--;
            j--;
        }
        else if (table[i - 1][j] >= table[i][j - 1])
            i--;
        else
            j--;
    }
    return result.reverse().join('');
};
export const longestCommonSubstring = (a, b) => {
    let previous = new Array(b.length + 1).fill(0);
    let bestLength = 0;
    let bestEnd = 0;
    for (let i = 1; i <= a.length; i++) {
        const current = new Array(b.length + 1).fill(0);
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] !== b[j - 1])
                continue;
            current[j] = previous[j - 1] + 1;
            if (current[j] > bestLength) {
                bestLength = current[j];
                bestEnd = i;
            }
        }
        previous = current;
    }
    return a.slice(bestEnd - bestLength, bestEnd);
};
