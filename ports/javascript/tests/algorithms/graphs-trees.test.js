import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { aStar, aStarGrid } from '../../algorithms/graphs/a-star.js';
import { bellmanFord } from '../../algorithms/graphs/bellman-ford.js';
import { bfs, gridShortestPath, shortestPathUnweighted } from '../../algorithms/graphs/bfs.js';
import { bipartiteColoring, isBipartite } from '../../algorithms/graphs/bipartite.js';
import { findBridgesAndArticulationPoints } from '../../algorithms/graphs/bridges-and-articulation-points.js';
import { connectedComponents } from '../../algorithms/graphs/connected-components.js';
import { hasCycleDirected, hasCycleUndirected } from '../../algorithms/graphs/cycle-detection.js';
import { dfs, dfsRecursive, hasPath } from '../../algorithms/graphs/dfs.js';
import { dijkstra, dijkstraPath } from '../../algorithms/graphs/dijkstra.js';
import { eulerianPathDirected } from '../../algorithms/graphs/eulerian-path.js';
import { floodFill } from '../../algorithms/graphs/flood-fill.js';
import { floydWarshall, floydWarshallPath } from '../../algorithms/graphs/floyd-warshall.js';
import { edmondsKarp } from '../../algorithms/graphs/max-flow.js';
import { kruskal, prim } from '../../algorithms/graphs/minimum-spanning-tree.js';
import { kosarajuScc, tarjanScc } from '../../algorithms/graphs/strongly-connected-components.js';
import { topologicalSortDfs, topologicalSortKahn } from '../../algorithms/graphs/topological-sort.js';
import { toUndirected, toWeightedUndirected } from '../../algorithms/graphs/types.js';
import { fromLevelOrder, inOrder, invertTree, isValidBst, levelOrder, lowestCommonAncestorBst, maxDepth, maxValue, postOrder, preOrder, } from '../../algorithms/trees/binary-tree.js';
import { LowestCommonAncestor } from '../../algorithms/trees/lowest-common-ancestor.js';
import { treeDiameter } from '../../algorithms/trees/tree-diameter.js';
const directed = [[1, 2], [5], [3, 4], [5], [5], [6], []];
const weightedEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 1 },
    { from: 2, to: 1, weight: 2 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 3, weight: 5 },
    { from: 3, to: 4, weight: 3 },
];
describe('Traversals', () => {
    it('bfs computes distances and paths', () => {
        const { order, distance } = bfs(directed, 0);
        assert.deepEqual(order, [0, 1, 2, 5, 3, 4, 6]);
        assert.deepEqual(distance, [0, 1, 1, 2, 2, 2, 3]);
        assert.deepEqual(shortestPathUnweighted(directed, 0, 6), [0, 1, 5, 6]);
        assert.equal(shortestPathUnweighted(directed, 6, 0), null);
    });
    it('dfs variants agree', () => {
        assert.deepEqual(dfs(directed, 0), [0, 1, 5, 6, 2, 3, 4]);
        assert.deepEqual(dfsRecursive(directed, 0), dfs(directed, 0));
        assert.equal(hasPath(directed, 2, 6), true);
        assert.equal(hasPath(directed, 5, 2), false);
    });
    it('grid search and flood fill', () => {
        const grid = ['..#.', '..#.', '....'];
        assert.equal(gridShortestPath(grid, [0, 0], [0, 3]), 7);
        assert.equal(gridShortestPath(['.#', '#.'], [0, 0], [1, 1]), -1);
        assert.deepEqual(aStarGrid(grid, [0, 0], [0, 3])?.length, 8);
        assert.equal(aStarGrid(['.#', '#.'], [0, 0], [1, 1]), null);
        assert.deepEqual(floodFill([
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 1],
        ], 0, 0, 2), [
            [2, 2, 0],
            [2, 0, 0],
            [2, 2, 2],
        ]);
    });
});
describe('Graph structure', () => {
    it('topological sort detects cycles', () => {
        for (const sort of [topologicalSortKahn, topologicalSortDfs]) {
            const order = sort(directed);
            const position = new Map(order.map((v, i) => [v, i]));
            directed.forEach((neighbors, v) => neighbors.forEach((n) => assert.ok(position.get(v) < position.get(n))));
            assert.equal(sort([[1], [2], [0]]), null);
        }
        assert.equal(hasCycleDirected(directed), false);
        assert.equal(hasCycleUndirected(3, [[0, 1], [1, 2]]), false);
        assert.equal(hasCycleUndirected(3, [[0, 1], [1, 2], [2, 0]]), true);
    });
    it('bipartite and components', () => {
        const square = toUndirected(4, [[0, 1], [1, 2], [2, 3], [3, 0]]);
        assert.deepEqual(bipartiteColoring(square), [0, 1, 0, 1]);
        assert.equal(isBipartite(toUndirected(3, [[0, 1], [1, 2], [2, 0]])), false);
        assert.deepEqual(connectedComponents(toUndirected(6, [[0, 1], [2, 3], [3, 4]])), [[0, 1], [2, 3, 4], [5]]);
    });
    it('strongly connected components', () => {
        const graph = [[1], [2], [0, 3], [4], [5], [3], []];
        const expected = [[0, 1, 2], [3, 4, 5], [6]];
        const normalize = (components) => components.sort((a, b) => a[0] - b[0]);
        assert.deepEqual(normalize(tarjanScc(graph)), expected);
        assert.deepEqual(normalize(kosarajuScc(graph)), expected);
    });
    it('bridges and articulation points', () => {
        const graph = toUndirected(7, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3], [5, 6]]);
        assert.deepEqual(findBridgesAndArticulationPoints(graph), {
            bridges: [[1, 3], [5, 6]],
            articulationPoints: [1, 3, 5],
        });
    });
    it('eulerian path', () => {
        assert.deepEqual(eulerianPathDirected([[1], [2], [0, 3], []]), [2, 0, 1, 2, 3]);
        assert.deepEqual(eulerianPathDirected([[1], [2], [0]]), [0, 1, 2, 0]);
        assert.equal(eulerianPathDirected([[1, 2], [], []]), null);
    });
});
describe('Shortest paths', () => {
    it('dijkstra, bellman-ford and floyd-warshall agree', () => {
        const graph = Array.from({ length: 5 }, () => []);
        for (const { from, to, weight } of weightedEdges)
            graph[from].push({ to, weight });
        const expected = [0, 3, 1, 4, 7];
        assert.deepEqual(dijkstra(graph, 0).distance, expected);
        assert.deepEqual(dijkstraPath(graph, 0, 4), { distance: 7, path: [0, 2, 1, 3, 4] });
        assert.equal(dijkstraPath(graph, 4, 0), null);
        const bf = bellmanFord(5, weightedEdges, 0);
        assert.deepEqual(bf.distance, expected);
        assert.equal(bf.hasNegativeCycle, false);
        const matrix = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => (i === j ? 0 : Infinity)));
        for (const { from, to, weight } of weightedEdges)
            matrix[from][to] = weight;
        const fw = floydWarshall(matrix);
        assert.deepEqual(fw.distance[0], expected);
        assert.deepEqual(floydWarshallPath(fw.next, 0, 4), [0, 2, 1, 3, 4]);
        assert.equal(floydWarshallPath(fw.next, 4, 0), null);
    });
    it('bellman-ford detects negative cycles', () => {
        const edges = [
            { from: 0, to: 1, weight: 1 },
            { from: 1, to: 2, weight: -2 },
            { from: 2, to: 1, weight: 1 },
        ];
        assert.equal(bellmanFord(3, edges, 0).hasNegativeCycle, true);
    });
    it('generic a* works on any graph', () => {
        const graph = { a: { b: 1, c: 4 }, b: { c: 1, d: 5 }, c: { d: 1 }, d: {} };
        const result = aStar({
            start: 'a',
            goal: 'd',
            neighbors: (node) => Object.entries(graph[node]).map(([next, cost]) => ({ node: next, cost })),
            heuristic: () => 0,
        });
        assert.deepEqual(result, { path: ['a', 'b', 'c', 'd'], cost: 3 });
    });
});
describe('Spanning trees and flows', () => {
    it('prim and kruskal find the same weight', () => {
        const edges = [
            { from: 0, to: 1, weight: 7 },
            { from: 0, to: 3, weight: 5 },
            { from: 1, to: 2, weight: 8 },
            { from: 1, to: 3, weight: 9 },
            { from: 1, to: 4, weight: 7 },
            { from: 2, to: 4, weight: 5 },
            { from: 3, to: 4, weight: 15 },
            { from: 3, to: 5, weight: 6 },
            { from: 4, to: 5, weight: 8 },
            { from: 4, to: 6, weight: 9 },
            { from: 5, to: 6, weight: 11 },
        ];
        assert.equal(kruskal(7, edges).weight, 39);
        assert.equal(kruskal(7, edges).edges.length, 6);
        assert.equal(prim(toWeightedUndirected(7, edges)).weight, 39);
    });
    it('edmonds-karp computes max flow', () => {
        const capacity = [
            [0, 16, 13, 0, 0, 0],
            [0, 0, 10, 12, 0, 0],
            [0, 4, 0, 0, 14, 0],
            [0, 0, 9, 0, 0, 20],
            [0, 0, 0, 7, 0, 4],
            [0, 0, 0, 0, 0, 0],
        ];
        assert.equal(edmondsKarp(capacity, 0, 5), 23);
    });
});
describe('Tree algorithms', () => {
    const root = fromLevelOrder([8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13]);
    it('traverses binary trees', () => {
        assert.deepEqual(preOrder(root), [8, 3, 1, 6, 4, 7, 10, 14, 13]);
        assert.deepEqual(inOrder(root), [1, 3, 4, 6, 7, 8, 10, 13, 14]);
        assert.deepEqual(postOrder(root), [1, 4, 7, 6, 3, 13, 14, 10, 8]);
        assert.deepEqual(levelOrder(root), [[8], [3, 10], [1, 6, 14], [4, 7, 13]]);
        assert.equal(maxDepth(root), 4);
        assert.equal(maxValue(root), 14);
        assert.equal(maxValue(null), null);
    });
    it('validates and inverts', () => {
        assert.equal(isValidBst(root), true);
        assert.equal(lowestCommonAncestorBst(root, 4, 7)?.value, 6);
        assert.equal(lowestCommonAncestorBst(root, 1, 13)?.value, 8);
        const inverted = invertTree(fromLevelOrder([1, 2, 3]));
        assert.deepEqual(levelOrder(inverted), [[1], [3, 2]]);
        assert.equal(isValidBst(fromLevelOrder([2, 3, 1])), false);
    });
    it('binary lifting LCA and diameter', () => {
        const tree = toUndirected(9, [[0, 1], [0, 2], [1, 3], [1, 4], [4, 5], [2, 6], [6, 7], [7, 8]]);
        const lca = new LowestCommonAncestor(tree, 0);
        assert.equal(lca.lca(3, 5), 1);
        assert.equal(lca.lca(5, 8), 0);
        assert.equal(lca.lca(7, 8), 7);
        assert.equal(lca.distance(5, 8), 7);
        assert.equal(lca.ancestor(8, 2), 6);
        const { length, path } = treeDiameter(tree);
        assert.equal(length, 7);
        assert.equal(path.length, 8);
    });
});
