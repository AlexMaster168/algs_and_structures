export const eulerianPathDirected = (graph) => {
    const n = graph.length;
    const inDegree = new Array(n).fill(0);
    let edgeCount = 0;
    for (const neighbors of graph) {
        for (const neighbor of neighbors)
            inDegree[neighbor]++;
        edgeCount += neighbors.length;
    }
    if (edgeCount === 0)
        return n > 0 ? [0] : [];
    let start = graph.findIndex((neighbors) => neighbors.length > 0);
    let starts = 0;
    let ends = 0;
    for (let vertex = 0; vertex < n; vertex++) {
        const balance = graph[vertex].length - inDegree[vertex];
        if (balance === 1) {
            starts++;
            start = vertex;
        }
        else if (balance === -1)
            ends++;
        else if (balance !== 0)
            return null;
    }
    if (!((starts === 0 && ends === 0) || (starts === 1 && ends === 1)))
        return null;
    const nextEdge = new Array(n).fill(0);
    const stack = [start];
    const path = [];
    while (stack.length) {
        const vertex = stack[stack.length - 1];
        if (nextEdge[vertex] < graph[vertex].length)
            stack.push(graph[vertex][nextEdge[vertex]++]);
        else
            path.push(stack.pop());
    }
    return path.length === edgeCount + 1 ? path.reverse() : null;
};
