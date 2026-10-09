export const tarjanScc = (graph) => {
    const n = graph.length;
    const index = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const onStack = new Array(n).fill(false);
    const stack = [];
    const components = [];
    let counter = 0;
    const connect = (vertex) => {
        index[vertex] = low[vertex] = counter++;
        stack.push(vertex);
        onStack[vertex] = true;
        for (const neighbor of graph[vertex]) {
            if (index[neighbor] === -1) {
                connect(neighbor);
                low[vertex] = Math.min(low[vertex], low[neighbor]);
            }
            else if (onStack[neighbor]) {
                low[vertex] = Math.min(low[vertex], index[neighbor]);
            }
        }
        if (low[vertex] !== index[vertex])
            return;
        const component = [];
        let member;
        do {
            member = stack.pop();
            onStack[member] = false;
            component.push(member);
        } while (member !== vertex);
        components.push(component.sort((a, b) => a - b));
    };
    for (let vertex = 0; vertex < n; vertex++)
        if (index[vertex] === -1)
            connect(vertex);
    return components;
};
export const kosarajuScc = (graph) => {
    const n = graph.length;
    const reversed = Array.from({ length: n }, () => []);
    graph.forEach((neighbors, vertex) => neighbors.forEach((neighbor) => reversed[neighbor].push(vertex)));
    const visited = new Array(n).fill(false);
    const finishOrder = [];
    const fill = (vertex) => {
        visited[vertex] = true;
        for (const neighbor of graph[vertex])
            if (!visited[neighbor])
                fill(neighbor);
        finishOrder.push(vertex);
    };
    const collect = (vertex, component) => {
        visited[vertex] = true;
        component.push(vertex);
        for (const neighbor of reversed[vertex])
            if (!visited[neighbor])
                collect(neighbor, component);
    };
    for (let vertex = 0; vertex < n; vertex++)
        if (!visited[vertex])
            fill(vertex);
    visited.fill(false);
    const components = [];
    for (const vertex of finishOrder.reverse()) {
        if (visited[vertex])
            continue;
        const component = [];
        collect(vertex, component);
        components.push(component.sort((a, b) => a - b));
    }
    return components;
};
