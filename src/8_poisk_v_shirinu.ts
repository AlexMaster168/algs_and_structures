// Поиск в ширину в графе

const graph: {[x: string] : any} = {}
graph.a = ['b', 'c']
graph.b = ['f']
graph.c = ['d', 'e']
graph.d = ['f']
graph.e = ['f']
graph.f = ['g']

function breadthSearch(graph: { [x: string]: any }, start: string, end: string) {
    let queue: string[] = []
    queue.push(start)
    while (queue.length > 0) {
        const current: any = queue.shift()
        if (!graph[current]) {
            graph[current] = []
        }
        if (graph[current].includes(end)) return true
        else queue = [...queue, ...graph[current]]
    }
    return false
}

console.log(breadthSearch(graph, 'a', 'e'))
