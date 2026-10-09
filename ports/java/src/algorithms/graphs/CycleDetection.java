package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class CycleDetection {
public static boolean hasCycleDirected(List<List<Integer>> g){return TopologicalSort.topologicalSortKahn(g)==null;}public static boolean hasCycleUndirected(int n,List<int[]> edges){data_structures.graphs.DisjointSet s=new data_structures.graphs.DisjointSet(n);for(int[] e:edges)if(!s.union(e[0],e[1]))return true;return false;}
}
