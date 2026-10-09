export const activitySelection = (intervals) => {
    const selected = [];
    let lastEnd = -Infinity;
    for (const interval of [...intervals].sort((a, b) => a.end - b.end)) {
        if (interval.start < lastEnd)
            continue;
        selected.push(interval);
        lastEnd = interval.end;
    }
    return selected;
};
export const mergeIntervals = (intervals) => {
    const merged = [];
    for (const { start, end } of [...intervals].sort((a, b) => a.start - b.start)) {
        const last = merged[merged.length - 1];
        if (last && start <= last.end)
            last.end = Math.max(last.end, end);
        else
            merged.push({ start, end });
    }
    return merged;
};
export const minMeetingRooms = (intervals) => {
    const starts = intervals.map((i) => i.start).sort((a, b) => a - b);
    const ends = intervals.map((i) => i.end).sort((a, b) => a - b);
    let rooms = 0;
    let maxRooms = 0;
    for (let s = 0, e = 0; s < starts.length;) {
        if (starts[s] < ends[e]) {
            rooms++;
            s++;
        }
        else {
            rooms--;
            e++;
        }
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
};
