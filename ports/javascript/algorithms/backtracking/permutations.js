export const permutations = (items) => {
    const result = [];
    const current = [];
    const used = new Array(items.length).fill(false);
    const build = () => {
        if (current.length === items.length) {
            result.push([...current]);
            return;
        }
        for (let i = 0; i < items.length; i++) {
            if (used[i])
                continue;
            used[i] = true;
            current.push(items[i]);
            build();
            current.pop();
            used[i] = false;
        }
    };
    build();
    return result;
};
export const combinations = (items, size) => {
    const result = [];
    const current = [];
    const build = (start) => {
        if (current.length === size) {
            result.push([...current]);
            return;
        }
        for (let i = start; i <= items.length - (size - current.length); i++) {
            current.push(items[i]);
            build(i + 1);
            current.pop();
        }
    };
    build(0);
    return result;
};
export const subsets = (items) => {
    const result = [];
    const current = [];
    const build = (index) => {
        if (index === items.length) {
            result.push([...current]);
            return;
        }
        build(index + 1);
        current.push(items[index]);
        build(index + 1);
        current.pop();
    };
    build(0);
    return result;
};
export const combinationSum = (candidates, target) => {
    const sorted = [...new Set(candidates)].sort((a, b) => a - b);
    const result = [];
    const current = [];
    const build = (start, remaining) => {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < sorted.length && sorted[i] <= remaining; i++) {
            current.push(sorted[i]);
            build(i, remaining - sorted[i]);
            current.pop();
        }
    };
    build(0, target);
    return result;
};
