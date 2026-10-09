export const dfs = (graph, start) => {
    const visited = new Array(graph.length).fill(false);
    const order = [];
    const stack = [start];
    while (stack.length) {
        const vertex = stack.pop();
        if (visited[vertex])
            continue;
        visited[vertex] = true;
        order.push(vertex);
        const neighbors = graph[vertex];
        for (let i = neighbors.length - 1; i >= 0; i--) {
            if (!visited[neighbors[i]])
                stack.push(neighbors[i]);
        }
    }
    return order;
};
export const dfsRecursive = (graph, start) => {
    const visited = new Array(graph.length).fill(false);
    const order = [];
    const visit = (vertex) => {
        visited[vertex] = true;
        order.push(vertex);
        for (const neighbor of graph[vertex])
            if (!visited[neighbor])
                visit(neighbor);
    };
    visit(start);
    return order;
};
export const hasPath = (graph, from, to) => dfs(graph, from).includes(to);
