use super::types::AdjacencyList;
pub struct CutStructure {
    pub bridges: Vec<(usize, usize)>,
    pub articulation_points: Vec<usize>,
}
pub fn find_bridges_and_articulation_points(graph: &AdjacencyList) -> CutStructure {
    struct Search<'a> {
        graph: &'a AdjacencyList,
        entry: Vec<Option<usize>>,
        low: Vec<usize>,
        cut: Vec<bool>,
        bridges: Vec<(usize, usize)>,
        timer: usize,
    }
    impl Search<'_> {
        fn visit(&mut self, vertex: usize, parent: Option<usize>) {
            self.entry[vertex] = Some(self.timer);
            self.low[vertex] = self.timer;
            self.timer += 1;
            let mut children = 0;
            let mut skipped = false;
            for i in 0..self.graph[vertex].len() {
                let neighbor = self.graph[vertex][i];
                if Some(neighbor) == parent && !skipped {
                    skipped = true;
                    continue;
                }
                if let Some(entry) = self.entry[neighbor] {
                    self.low[vertex] = self.low[vertex].min(entry);
                    continue;
                }
                self.visit(neighbor, Some(vertex));
                children += 1;
                self.low[vertex] = self.low[vertex].min(self.low[neighbor]);
                if self.low[neighbor] > self.entry[vertex].unwrap() {
                    self.bridges
                        .push((vertex.min(neighbor), vertex.max(neighbor)));
                }
                if parent.is_some() && self.low[neighbor] >= self.entry[vertex].unwrap() {
                    self.cut[vertex] = true;
                }
            }
            if parent.is_none() && children > 1 {
                self.cut[vertex] = true;
            }
        }
    }
    let n = graph.len();
    let mut search = Search {
        graph,
        entry: vec![None; n],
        low: vec![0; n],
        cut: vec![false; n],
        bridges: Vec::new(),
        timer: 0,
    };
    for vertex in 0..n {
        if search.entry[vertex].is_none() {
            search.visit(vertex, None);
        }
    }
    search.bridges.sort_unstable();
    CutStructure {
        bridges: search.bridges,
        articulation_points: search
            .cut
            .iter()
            .enumerate()
            .filter_map(|(i, &cut)| cut.then_some(i))
            .collect(),
    }
}
