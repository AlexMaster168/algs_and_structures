use std::collections::{HashMap, HashSet};
use std::hash::Hash;
#[derive(Clone)]
pub struct GraphEdge<V> {
    pub from: V,
    pub to: V,
    pub weight: f64,
}
pub struct Graph<V> {
    pub directed: bool,
    adjacency: HashMap<V, Vec<(V, f64)>>,
    order: Vec<V>,
}
impl<V: Eq + Hash + Clone> Graph<V> {
    pub fn new(directed: bool) -> Self {
        Self {
            directed,
            adjacency: HashMap::new(),
            order: Vec::new(),
        }
    }
    pub fn vertex_count(&self) -> usize {
        self.adjacency.len()
    }
    pub fn edge_count(&self) -> usize {
        self.edges().len()
    }
    pub fn add_vertex(&mut self, vertex: V) -> &mut Self {
        if !self.adjacency.contains_key(&vertex) {
            self.order.push(vertex.clone());
            self.adjacency.insert(vertex, Vec::new());
        }
        self
    }
    pub fn add_edge(&mut self, from: V, to: V, weight: f64) -> &mut Self {
        self.add_vertex(from.clone()).add_vertex(to.clone());
        fn set<V: PartialEq>(neighbors: &mut Vec<(V, f64)>, to: V, weight: f64) {
            if let Some(item) = neighbors.iter_mut().find(|(v, _)| v == &to) {
                item.1 = weight;
            } else {
                neighbors.push((to, weight));
            }
        }
        set(self.adjacency.get_mut(&from).unwrap(), to.clone(), weight);
        if !self.directed {
            set(self.adjacency.get_mut(&to).unwrap(), from, weight);
        }
        self
    }
    pub fn remove_edge(&mut self, from: &V, to: &V) -> bool {
        let removed = if let Some(neighbors) = self.adjacency.get_mut(from) {
            if let Some(i) = neighbors.iter().position(|(v, _)| v == to) {
                neighbors.remove(i);
                true
            } else {
                false
            }
        } else {
            false
        };
        if removed && !self.directed {
            self.adjacency
                .get_mut(to)
                .unwrap()
                .retain(|(v, _)| v != from);
        }
        removed
    }
    pub fn remove_vertex(&mut self, vertex: &V) -> bool {
        if self.adjacency.remove(vertex).is_none() {
            return false;
        }
        self.order.retain(|v| v != vertex);
        for neighbors in self.adjacency.values_mut() {
            neighbors.retain(|(v, _)| v != vertex);
        }
        true
    }
    pub fn has_vertex(&self, vertex: &V) -> bool {
        self.adjacency.contains_key(vertex)
    }
    pub fn has_edge(&self, from: &V, to: &V) -> bool {
        self.weight(from, to).is_some()
    }
    pub fn weight(&self, from: &V, to: &V) -> Option<f64> {
        self.adjacency
            .get(from)?
            .iter()
            .find(|(v, _)| v == to)
            .map(|(_, w)| *w)
    }
    pub fn neighbors(&self, vertex: &V) -> Vec<V> {
        self.adjacency.get(vertex).map_or_else(Vec::new, |items| {
            items.iter().map(|(v, _)| v.clone()).collect()
        })
    }
    pub fn degree(&self, vertex: &V) -> usize {
        self.adjacency.get(vertex).map_or(0, Vec::len)
    }
    pub fn vertices(&self) -> Vec<V> {
        self.order.clone()
    }
    pub fn edges(&self) -> Vec<GraphEdge<V>> {
        let mut seen = HashSet::new();
        let mut result = Vec::new();
        for from in &self.order {
            for (to, weight) in &self.adjacency[from] {
                if self.directed || !seen.contains(to) {
                    result.push(GraphEdge {
                        from: from.clone(),
                        to: to.clone(),
                        weight: *weight,
                    });
                }
            }
            seen.insert(from.clone());
        }
        result
    }
    pub fn to_adjacency_matrix(&self) -> (Vec<V>, Vec<Vec<f64>>) {
        let vertices = self.vertices();
        let index: HashMap<_, _> = vertices.iter().enumerate().map(|(i, v)| (v, i)).collect();
        let mut matrix = vec![vec![0.0; vertices.len()]; vertices.len()];
        for from in &vertices {
            for (to, weight) in &self.adjacency[from] {
                matrix[index[from]][index[to]] = *weight;
            }
        }
        (vertices, matrix)
    }
    pub fn to_adjacency_list(&self) -> (Vec<V>, Vec<Vec<usize>>) {
        let vertices = self.vertices();
        let index: HashMap<_, _> = vertices.iter().enumerate().map(|(i, v)| (v, i)).collect();
        let list = vertices
            .iter()
            .map(|from| {
                self.adjacency[from]
                    .iter()
                    .map(|(to, _)| index[to])
                    .collect()
            })
            .collect();
        (vertices, list)
    }
}
