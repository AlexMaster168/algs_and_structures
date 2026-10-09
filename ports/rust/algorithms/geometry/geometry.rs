#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}
pub fn cross(o: Point, a: Point, b: Point) -> f64 {
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
}
pub fn distance(a: Point, b: Point) -> f64 {
    (a.x - b.x).hypot(a.y - b.y)
}
pub fn convex_hull(points: &[Point]) -> Vec<Point> {
    let mut sorted = points.to_vec();
    sorted.sort_by(|a, b| a.x.total_cmp(&b.x).then(a.y.total_cmp(&b.y)));
    if sorted.len() < 3 {
        return sorted;
    }
    fn build(points: impl Iterator<Item = Point>) -> Vec<Point> {
        let mut hull = Vec::new();
        for point in points {
            while hull.len() >= 2
                && cross(hull[hull.len() - 2], *hull.last().unwrap(), point) <= 0.0
            {
                hull.pop();
            }
            hull.push(point);
        }
        hull.pop();
        hull
    }
    let mut hull = build(sorted.iter().copied());
    hull.extend(build(sorted.iter().rev().copied()));
    hull
}
pub fn polygon_area(polygon: &[Point]) -> f64 {
    let mut area = 0.0;
    for i in 0..polygon.len() {
        let a = polygon[i];
        let b = polygon[(i + 1) % polygon.len()];
        area += a.x * b.y - b.x * a.y;
    }
    area.abs() / 2.0
}
pub fn point_in_polygon(point: Point, polygon: &[Point]) -> bool {
    if polygon.is_empty() {
        return false;
    }
    let mut inside = false;
    let mut j = polygon.len() - 1;
    for i in 0..polygon.len() {
        let a = polygon[i];
        let b = polygon[j];
        if (a.y > point.y) != (b.y > point.y)
            && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x
        {
            inside = !inside;
        }
        j = i;
    }
    inside
}
pub fn segments_intersect(p1: Point, p2: Point, q1: Point, q2: Point) -> bool {
    fn sign(value: f64) -> i8 {
        if value > 0.0 {
            1
        } else if value < 0.0 {
            -1
        } else {
            0
        }
    }
    fn on(p: Point, q: Point, r: Point) -> bool {
        p.x.min(r.x) <= q.x && q.x <= p.x.max(r.x) && p.y.min(r.y) <= q.y && q.y <= p.y.max(r.y)
    }
    let a = sign(cross(p1, p2, q1));
    let b = sign(cross(p1, p2, q2));
    let c = sign(cross(q1, q2, p1));
    let d = sign(cross(q1, q2, p2));
    (a != b && c != d)
        || (a == 0 && on(p1, q1, p2))
        || (b == 0 && on(p1, q2, p2))
        || (c == 0 && on(q1, p1, q2))
        || (d == 0 && on(q1, p2, q2))
}
pub struct ClosestPairResult {
    pub a: Point,
    pub b: Point,
    pub distance: f64,
}
pub fn closest_pair(points: &[Point]) -> Option<ClosestPairResult> {
    if points.len() < 2 {
        return None;
    }
    let mut sorted = points.to_vec();
    sorted.sort_by(|a, b| a.x.total_cmp(&b.x));
    let mut best = ClosestPairResult {
        a: sorted[0],
        b: sorted[1],
        distance: distance(sorted[0], sorted[1]),
    };
    fn update(best: &mut ClosestPairResult, a: Point, b: Point) {
        let d = distance(a, b);
        if d < best.distance {
            *best = ClosestPairResult { a, b, distance: d };
        }
    }
    fn solve(points: &[Point], best: &mut ClosestPairResult) -> Vec<Point> {
        if points.len() <= 3 {
            for i in 0..points.len() {
                for j in i + 1..points.len() {
                    update(best, points[i], points[j]);
                }
            }
            let mut result = points.to_vec();
            result.sort_by(|a, b| a.y.total_cmp(&b.y));
            return result;
        }
        let mid = points.len() / 2;
        let x = points[mid].x;
        let left = solve(&points[..mid], best);
        let right = solve(&points[mid..], best);
        let mut merged = Vec::with_capacity(points.len());
        let (mut i, mut j) = (0, 0);
        while i < left.len() || j < right.len() {
            if j == right.len() || (i < left.len() && left[i].y <= right[j].y) {
                merged.push(left[i]);
                i += 1;
            } else {
                merged.push(right[j]);
                j += 1;
            }
        }
        let strip: Vec<_> = merged
            .iter()
            .copied()
            .filter(|p| (p.x - x).abs() < best.distance)
            .collect();
        for i in 0..strip.len() {
            let mut j = i + 1;
            while j < strip.len() && strip[j].y - strip[i].y < best.distance {
                update(best, strip[i], strip[j]);
                j += 1;
            }
        }
        merged
    }
    solve(&sorted, &mut best);
    Some(best)
}
