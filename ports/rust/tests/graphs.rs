use algorithm_collection::algorithms::graphs::{
    a_star::a_star_grid,
    bellman_ford::bellman_ford,
    bridges_and_articulation_points::find_bridges_and_articulation_points,
    dijkstra::dijkstra,
    eulerian_path::eulerian_path_directed,
    floyd_warshall::floyd_warshall,
    minimum_spanning_tree::{kruskal, prim},
    strongly_connected_components::{kosaraju_scc, tarjan_scc},
    topological_sort::{topological_sort_dfs, topological_sort_kahn},
    types::{to_undirected, to_weighted_undirected, Edge},
};
#[test]
fn paths_and_spanning_trees() {
    let mut seed = 921u32;
    for _ in 0..100 {
        let n = 12;
        let mut edges = Vec::new();
        for v in 1..n {
            edges.push(Edge {
                from: v - 1,
                to: v,
                weight: 1.0,
            });
        }
        for a in 0..n {
            for b in a + 1..n {
                seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
                if seed % 3 == 0 {
                    edges.push(Edge {
                        from: a,
                        to: b,
                        weight: (seed % 19 + 1) as f64,
                    });
                }
            }
        }
        let graph = to_weighted_undirected(n, &edges);
        let directed: Vec<_> = graph
            .iter()
            .enumerate()
            .flat_map(|(from, neighbors)| {
                neighbors.iter().map(move |edge| Edge {
                    from,
                    to: edge.to,
                    weight: edge.weight,
                })
            })
            .collect();
        let mut weights = vec![vec![f64::INFINITY; n]; n];
        for edge in &directed {
            weights[edge.from][edge.to] = weights[edge.from][edge.to].min(edge.weight);
        }
        let all = floyd_warshall(&weights);
        assert!(!all.has_negative_cycle);
        for source in 0..n {
            let first = dijkstra(&graph, source);
            let second = bellman_ford(n, &directed, source);
            assert!(!second.has_negative_cycle);
            assert_eq!(first.distance, second.distance);
            assert_eq!(first.distance, all.distance[source]);
        }
        assert_eq!(kruskal(n, &edges).weight, prim(&graph, 0).weight);
    }
}
#[test]
fn components_cycles_and_cuts() {
    let mut seed = 732u32;
    for _ in 0..100 {
        let n = 12;
        let mut graph = vec![Vec::new(); n];
        for (a, neighbors) in graph.iter_mut().enumerate() {
            for b in 0..n {
                seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
                if a != b && seed % 7 == 0 {
                    neighbors.push(b);
                }
            }
        }
        let mut first = tarjan_scc(&graph);
        let mut second = kosaraju_scc(&graph);
        first.sort();
        second.sort();
        assert_eq!(first, second);
        assert_eq!(
            topological_sort_kahn(&graph).is_some(),
            topological_sort_dfs(&graph).is_some()
        );
    }
    let graph = to_undirected(4, &[(0, 1), (0, 1), (1, 2), (2, 3)]);
    let cuts = find_bridges_and_articulation_points(&graph);
    assert_eq!(cuts.bridges, vec![(1, 2), (2, 3)]);
    assert_eq!(cuts.articulation_points, vec![1, 2]);
    assert_eq!(
        eulerian_path_directed(&vec![vec![1], vec![2], vec![0]]),
        Some(vec![0, 1, 2, 0])
    );
    assert!(eulerian_path_directed(&vec![vec![1], vec![], vec![3], vec![]]).is_none());
    let path = a_star_grid(
        &["...".into(), ".#.".into(), "...".into()],
        (0, 0),
        (2, 2),
        '#',
    )
    .unwrap();
    assert_eq!(path.len(), 5);
}
