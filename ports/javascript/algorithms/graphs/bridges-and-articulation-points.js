export const findBridgesAndArticulationPoints = (graph) => {
    const n = graph.length;
    const entry = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const isArticulation = new Array(n).fill(false);
    const bridges = [];
    let timer = 0;
    const visit = (vertex, parent) => {
        entry[vertex] = low[vertex] = timer++;
        let children = 0;
        let skippedParent = false;
        for (const neighbor of graph[vertex]) {
            if (neighbor === parent && !skippedParent) {
                skippedParent = true;
                continue;
            }
            if (entry[neighbor] !== -1) {
                low[vertex] = Math.min(low[vertex], entry[neighbor]);
                continue;
            }
            visit(neighbor, vertex);
            children++;
            low[vertex] = Math.min(low[vertex], low[neighbor]);
            if (low[neighbor] > entry[vertex])
                bridges.push([Math.min(vertex, neighbor), Math.max(vertex, neighbor)]);
            if (parent !== -1 && low[neighbor] >= entry[vertex])
                isArticulation[vertex] = true;
        }
        if (parent === -1 && children > 1)
            isArticulation[vertex] = true;
    };
    for (let vertex = 0; vertex < n; vertex++)
        if (entry[vertex] === -1)
            visit(vertex, -1);
    return {
        bridges: bridges.sort((a, b) => a[0] - b[0] || a[1] - b[1]),
        articulationPoints: isArticulation.flatMap((flag, vertex) => (flag ? [vertex] : [])),
    };
};
