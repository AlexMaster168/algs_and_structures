from ..graphs.bfs import bfs
from ..graphs.types import reconstruct_path


def tree_diameter(tree):
    if not tree:
        return {'length': 0, 'path': []}
    distances = bfs(tree, 0)['distance']
    first = max(range(len(tree)), key=distances.__getitem__)
    result = bfs(tree, first)
    second = max(range(len(tree)), key=result['distance'].__getitem__)
    return {'length': result['distance'][second], 'path': reconstruct_path(result['parent'], second)}
