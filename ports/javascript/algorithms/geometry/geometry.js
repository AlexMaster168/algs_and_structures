export const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const convexHull = (points) => {
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    if (sorted.length < 3)
        return sorted;
    const build = (sequence) => {
        const hull = [];
        for (const point of sequence) {
            while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0)
                hull.pop();
            hull.push(point);
        }
        hull.pop();
        return hull;
    };
    return [...build(sorted), ...build([...sorted].reverse())];
};
export const polygonArea = (polygon) => {
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % polygon.length];
        area += a.x * b.y - b.x * a.y;
    }
    return Math.abs(area) / 2;
};
export const pointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[i];
        const b = polygon[j];
        if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
            inside = !inside;
        }
    }
    return inside;
};
const onSegment = (p, q, r) => Math.min(p.x, r.x) <= q.x && q.x <= Math.max(p.x, r.x) && Math.min(p.y, r.y) <= q.y && q.y <= Math.max(p.y, r.y);
export const segmentsIntersect = (p1, p2, q1, q2) => {
    const d1 = Math.sign(cross(p1, p2, q1));
    const d2 = Math.sign(cross(p1, p2, q2));
    const d3 = Math.sign(cross(q1, q2, p1));
    const d4 = Math.sign(cross(q1, q2, p2));
    if (d1 !== d2 && d3 !== d4)
        return true;
    if (d1 === 0 && onSegment(p1, q1, p2))
        return true;
    if (d2 === 0 && onSegment(p1, q2, p2))
        return true;
    if (d3 === 0 && onSegment(q1, p1, q2))
        return true;
    return d4 === 0 && onSegment(q1, p2, q2);
};
export const closestPair = (points) => {
    if (points.length < 2)
        return null;
    const byX = [...points].sort((a, b) => a.x - b.x);
    let best = { a: byX[0], b: byX[1], distance: distance(byX[0], byX[1]) };
    const solve = (left, right) => {
        if (right - left <= 3) {
            for (let i = left; i < right; i++) {
                for (let j = i + 1; j < right; j++) {
                    const d = distance(byX[i], byX[j]);
                    if (d < best.distance)
                        best = { a: byX[i], b: byX[j], distance: d };
                }
            }
            return byX.slice(left, right).sort((a, b) => a.y - b.y);
        }
        const mid = (left + right) >> 1;
        const midX = byX[mid].x;
        const leftByY = solve(left, mid);
        const rightByY = solve(mid, right);
        const merged = [];
        for (let i = 0, j = 0; i < leftByY.length || j < rightByY.length;) {
            if (j >= rightByY.length || (i < leftByY.length && leftByY[i].y <= rightByY[j].y))
                merged.push(leftByY[i++]);
            else
                merged.push(rightByY[j++]);
        }
        const strip = merged.filter((p) => Math.abs(p.x - midX) < best.distance);
        for (let i = 0; i < strip.length; i++) {
            for (let j = i + 1; j < strip.length && strip[j].y - strip[i].y < best.distance; j++) {
                const d = distance(strip[i], strip[j]);
                if (d < best.distance)
                    best = { a: strip[i], b: strip[j], distance: d };
            }
        }
        return merged;
    };
    solve(0, byX.length);
    return best;
};
