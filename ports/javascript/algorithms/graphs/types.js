export const reconstructPath = (parent, target) => {
    const path = [];
    for (let vertex = target; vertex !== -1; vertex = parent[vertex])
        path.push(vertex);
    return path.reverse();
};
export const toUndirected = (vertexCount, edges) => {
    const graph = Array.from({ length: vertexCount }, () => []);
    for (const [a, b] of edges) {
        graph[a].push(b);
        graph[b].push(a);
    }
    return graph;
};
export const toWeightedUndirected = (vertexCount, edges) => {
    const graph = Array.from({ length: vertexCount }, () => []);
    for (const { from, to, weight } of edges) {
        graph[from].push({ to, weight });
        graph[to].push({ to: from, weight });
    }
    return graph;
};
