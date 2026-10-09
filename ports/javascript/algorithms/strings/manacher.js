export const longestPalindromicSubstring = (s) => {
    if (s.length < 2)
        return s;
    const t = `^#${s.split('').join('#')}#$`;
    const radius = new Array(t.length).fill(0);
    let center = 0;
    let right = 0;
    for (let i = 1; i < t.length - 1; i++) {
        if (i < right)
            radius[i] = Math.min(right - i, radius[2 * center - i]);
        while (t[i + radius[i] + 1] === t[i - radius[i] - 1])
            radius[i]++;
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
    }
    let bestCenter = 0;
    for (let i = 1; i < t.length - 1; i++)
        if (radius[i] > radius[bestCenter])
            bestCenter = i;
    const start = (bestCenter - radius[bestCenter]) >> 1;
    return s.slice(start, start + radius[bestCenter]);
};
