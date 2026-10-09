from ...data_structures.linear.queue import Queue
from .types import reconstruct_path


def bfs(graph, start):
    distance, parent, order = [-1] * len(graph), [-1] * len(graph), []
    queue = Queue().enqueue(start)
    distance[start] = 0
    while not queue.is_empty():
        vertex = queue.dequeue()
        order.append(vertex)
        for neighbor in graph[vertex]:
            if distance[neighbor] != -1:
                continue
            distance[neighbor], parent[neighbor] = distance[vertex] + 1, vertex
            queue.enqueue(neighbor)
    return {'order': order, 'distance': distance, 'parent': parent}


def shortest_path_unweighted(graph, start, target):
    result = bfs(graph, start)
    return None if result['distance'][target] == -1 else reconstruct_path(result['parent'], target)


def grid_shortest_path(grid, start, target, wall='#'):
    rows, cols = len(grid), len(grid[0]) if grid else 0
    distance = [[-1] * cols for _ in range(rows)]
    queue = Queue().enqueue(start)
    distance[start[0]][start[1]] = 0
    while not queue.is_empty():
        row, col = queue.dequeue()
        if (row, col) == tuple(target):
            return distance[row][col]
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            r, c = row + dr, col + dc
            if r < 0 or c < 0 or r >= rows or c >= cols:
                continue
            if grid[r][c] == wall or distance[r][c] != -1:
                continue
            distance[r][c] = distance[row][col] + 1
            queue.enqueue((r, c))
    return -1
