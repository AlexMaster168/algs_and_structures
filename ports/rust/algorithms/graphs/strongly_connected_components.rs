use super::types::AdjacencyList;
pub fn tarjan_scc(graph: &AdjacencyList) -> Vec<Vec<usize>> {
    struct Search<'a> {
        graph: &'a AdjacencyList,
        index: Vec<Option<usize>>,
        low: Vec<usize>,
        active: Vec<bool>,
        stack: Vec<usize>,
        timer: usize,
        result: Vec<Vec<usize>>,
    }
    impl Search<'_> {
        fn visit(&mut self, vertex: usize) {
            self.index[vertex] = Some(self.timer);
            self.low[vertex] = self.timer;
            self.timer += 1;
            self.stack.push(vertex);
            self.active[vertex] = true;
            for i in 0..self.graph[vertex].len() {
                let neighbor = self.graph[vertex][i];
                if self.index[neighbor].is_none() {
                    self.visit(neighbor);
                    self.low[vertex] = self.low[vertex].min(self.low[neighbor]);
                } else if self.active[neighbor] {
                    self.low[vertex] = self.low[vertex].min(self.index[neighbor].unwrap());
                }
            }
            if self.low[vertex] == self.index[vertex].unwrap() {
                let mut component = Vec::new();
                loop {
                    let member = self.stack.pop().unwrap();
                    self.active[member] = false;
                    component.push(member);
                    if member == vertex {
                        break;
                    }
                }
                component.sort_unstable();
                self.result.push(component);
            }
        }
    }
    let n = graph.len();
    let mut search = Search {
        graph,
        index: vec![None; n],
        low: vec![0; n],
        active: vec![false; n],
        stack: Vec::new(),
        timer: 0,
        result: Vec::new(),
    };
    for vertex in 0..n {
        if search.index[vertex].is_none() {
            search.visit(vertex);
        }
    }
    search.result
}
pub fn kosaraju_scc(graph: &AdjacencyList) -> Vec<Vec<usize>> {
    fn visit(graph: &AdjacencyList, vertex: usize, seen: &mut [bool], order: &mut Vec<usize>) {
        seen[vertex] = true;
        for &neighbor in &graph[vertex] {
            if !seen[neighbor] {
                visit(graph, neighbor, seen, order);
            }
        }
        order.push(vertex);
    }
    fn collect(
        graph: &AdjacencyList,
        vertex: usize,
        seen: &mut [bool],
        component: &mut Vec<usize>,
    ) {
        seen[vertex] = true;
        component.push(vertex);
        for &neighbor in &graph[vertex] {
            if !seen[neighbor] {
                collect(graph, neighbor, seen, component);
            }
        }
    }
    let n = graph.len();
    let mut seen = vec![false; n];
    let mut order = Vec::new();
    for vertex in 0..n {
        if !seen[vertex] {
            visit(graph, vertex, &mut seen, &mut order);
        }
    }
    let mut reverse = vec![Vec::new(); n];
    for (from, neighbors) in graph.iter().enumerate() {
        for &to in neighbors {
            reverse[to].push(from);
        }
    }
    seen.fill(false);
    let mut result = Vec::new();
    for &vertex in order.iter().rev() {
        if !seen[vertex] {
            let mut component = Vec::new();
            collect(&reverse, vertex, &mut seen, &mut component);
            component.sort_unstable();
            result.push(component);
        }
    }
    result
}
