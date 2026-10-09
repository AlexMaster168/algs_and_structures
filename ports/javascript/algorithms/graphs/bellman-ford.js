export const bellmanFord = (vertexCount, edges, source) => {
    const distance = new Array(vertexCount).fill(Infinity);
    const parent = new Array(vertexCount).fill(-1);
    distance[source] = 0;
    for (let i = 0; i < vertexCount - 1; i++) {
        let changed = false;
        for (const { from, to, weight } of edges) {
            if (distance[from] + weight < distance[to]) {
                distance[to] = distance[from] + weight;
                parent[to] = from;
                changed = true;
            }
        }
        if (!changed)
            break;
    }
    const hasNegativeCycle = edges.some(({ from, to, weight }) => distance[from] + weight < distance[to]);
    return { distance, parent, hasNegativeCycle };
};
