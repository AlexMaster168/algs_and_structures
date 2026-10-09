from math import hypot


def cross(o, a, b):
    return (a['x'] - o['x']) * (b['y'] - o['y']) - (a['y'] - o['y']) * (b['x'] - o['x'])


def distance(a, b):
    return hypot(a['x'] - b['x'], a['y'] - b['y'])


def convex_hull(points):
    ordered = sorted(points, key=lambda p: (p['x'], p['y']))
    if len(ordered) < 3:
        return ordered
    def build(sequence):
        hull = []
        for point in sequence:
            while len(hull) >= 2 and cross(hull[-2], hull[-1], point) <= 0:
                hull.pop()
            hull.append(point)
        return hull[:-1]
    return build(ordered) + build(reversed(ordered))


def polygon_area(polygon):
    return abs(sum(a['x'] * b['y'] - b['x'] * a['y'] for a, b in zip(polygon, polygon[1:] + polygon[:1]))) / 2


def point_in_polygon(point, polygon):
    inside = False
    for a, b in zip(polygon, polygon[-1:] + polygon[:-1]):
        if (a['y'] > point['y']) != (b['y'] > point['y']) and point['x'] < (b['x'] - a['x']) * (point['y'] - a['y']) / (b['y'] - a['y']) + a['x']:
            inside = not inside
    return inside


def segments_intersect(p1, p2, q1, q2):
    def on_segment(p, q, r):
        return min(p['x'], r['x']) <= q['x'] <= max(p['x'], r['x']) and min(p['y'], r['y']) <= q['y'] <= max(p['y'], r['y'])
    def sign(value):
        return (value > 0) - (value < 0)
    d1, d2, d3, d4 = [sign(value) for value in (cross(p1, p2, q1), cross(p1, p2, q2), cross(q1, q2, p1), cross(q1, q2, p2))]
    return d1 != d2 and d3 != d4 or d1 == 0 and on_segment(p1, q1, p2) or d2 == 0 and on_segment(p1, q2, p2) or d3 == 0 and on_segment(q1, p1, q2) or d4 == 0 and on_segment(q1, p2, q2)


def closest_pair(points):
    if len(points) < 2:
        return None
    ordered = sorted(points, key=lambda p: p['x'])
    best = {'a': ordered[0], 'b': ordered[1], 'distance': distance(ordered[0], ordered[1])}
    def update(a, b):
        candidate = distance(a, b)
        if candidate < best['distance']:
            best.update(a=a, b=b, distance=candidate)
    def solve(left, right):
        if right - left <= 3:
            for i in range(left, right):
                for j in range(i + 1, right):
                    update(ordered[i], ordered[j])
            return sorted(ordered[left:right], key=lambda p: p['y'])
        middle = (left + right) // 2
        mid_x = ordered[middle]['x']
        a, b = solve(left, middle), solve(middle, right)
        merged, i, j = [], 0, 0
        while i < len(a) or j < len(b):
            if j == len(b) or i < len(a) and a[i]['y'] <= b[j]['y']:
                merged.append(a[i])
                i += 1
            else:
                merged.append(b[j])
                j += 1
        strip = [p for p in merged if abs(p['x'] - mid_x) < best['distance']]
        for i, point in enumerate(strip):
            j = i + 1
            while j < len(strip) and strip[j]['y'] - point['y'] < best['distance']:
                update(point, strip[j])
                j += 1
        return merged
    solve(0, len(ordered))
    return best
