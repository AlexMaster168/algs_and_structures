import { bfs } from '../graphs/bfs.js';
import { reconstructPath } from '../graphs/types.js';
export const treeDiameter = (tree) => {
    if (tree.length === 0)
        return { length: 0, path: [] };
    const farthest = (distance) => distance.indexOf(Math.max(...distance));
    const first = farthest(bfs(tree, 0).distance);
    const { distance, parent } = bfs(tree, first);
    const second = farthest(distance);
    return { length: distance[second], path: reconstructPath(parent, second) };
};
