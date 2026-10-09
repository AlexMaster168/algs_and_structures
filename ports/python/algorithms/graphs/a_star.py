from math import inf
from ...data_structures.heaps.binary_heap import BinaryHeap


def a_star(options=None, *, start=None, goal=None, neighbors=None, heuristic=None, key=str):
    if options is not None:
        start, goal, neighbors, heuristic = (options[name] for name in ('start', 'goal', 'neighbors', 'heuristic'))
        key = options.get('key', str)
    goal_key, best_cost, came_from = key(goal), {key(start): 0}, {}
    open_nodes = BinaryHeap(lambda a, b: a[2] - b[2]).push((start, 0, heuristic(start)))
    while not open_nodes.is_empty():
        node, cost, _ = open_nodes.pop()
        node_key = key(node)
        if cost > best_cost[node_key]:
            continue
        if node_key == goal_key:
            path = [node]
            while node_key in came_from:
                current = came_from[node_key]
                path.append(current)
                node_key = key(current)
            return {'path': path[::-1], 'cost': cost}
        for next_entry in neighbors(node):
            next_node, next_cost = next_entry['node'], cost + next_entry['cost']
            next_key = key(next_node)
            if next_cost < best_cost.get(next_key, inf):
                best_cost[next_key], came_from[next_key] = next_cost, node
                open_nodes.push((next_node, next_cost, next_cost + heuristic(next_node)))
    return None


def a_star_grid(grid, start, goal, wall='#'):
    def neighbors(node):
        row, col = node
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            r, c = row + dr, col + dc
            if 0 <= r < len(grid) and 0 <= c < len(grid[r]) and grid[r][c] != wall:
                yield {'node': (r, c), 'cost': 1}

    result = a_star(start=tuple(start), goal=tuple(goal), key=lambda node: tuple(node), heuristic=lambda node: abs(node[0] - goal[0]) + abs(node[1] - goal[1]), neighbors=neighbors)
    return result['path'] if result else None
