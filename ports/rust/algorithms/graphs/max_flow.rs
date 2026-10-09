pub fn edmonds_karp(capacity: &[Vec<f64>], source: usize, sink: usize) -> f64 {
    if source == sink {
        return 0.0;
    }
    let n = capacity.len();
    let mut residual = capacity.to_vec();
    let mut flow = 0.0;
    loop {
        let mut parent = vec![None; n];
        let mut seen = vec![false; n];
        seen[source] = true;
        let mut queue = vec![source];
        let mut head = 0;
        while head < queue.len() && !seen[sink] {
            let vertex = queue[head];
            head += 1;
            for next in 0..n {
                if !seen[next] && residual[vertex][next] > 0.0 {
                    seen[next] = true;
                    parent[next] = Some(vertex);
                    queue.push(next);
                }
            }
        }
        if !seen[sink] {
            return flow;
        }
        let mut amount = f64::INFINITY;
        let mut vertex = sink;
        while vertex != source {
            let previous = parent[vertex].unwrap();
            amount = amount.min(residual[previous][vertex]);
            vertex = previous;
        }
        vertex = sink;
        while vertex != source {
            let previous = parent[vertex].unwrap();
            residual[previous][vertex] -= amount;
            residual[vertex][previous] += amount;
            vertex = previous;
        }
        flow += amount;
    }
}
