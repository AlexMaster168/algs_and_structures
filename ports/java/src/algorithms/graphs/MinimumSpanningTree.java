package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class MinimumSpanningTree {
public record SpanningTree(double weight,List<Types.Edge> edges){}public static SpanningTree kruskal(int n,List<Types.Edge> edges){data_structures.graphs.DisjointSet s=new data_structures.graphs.DisjointSet(n);List<Types.Edge> o=new ArrayList<>();double w=0;for(var e:algorithms.sorting.MergeSort.mergeSort(edges,Comparator.comparingDouble(Types.Edge::weight))){if(!s.union(e.from(),e.to()))continue;o.add(e);w+=e.weight();if(o.size()==n-1)break;}return new SpanningTree(w,o);}public static SpanningTree prim(List<List<Types.WeightedEdge>> g){return prim(g,0);}public static SpanningTree prim(List<List<Types.WeightedEdge>> g,int start){boolean[] v=new boolean[g.size()];data_structures.heaps.BinaryHeap.Heap<Types.Edge> h=new data_structures.heaps.BinaryHeap.Heap<>(Comparator.comparingDouble(Types.Edge::weight));List<Types.Edge> o=new ArrayList<>();double w=0;visit(g,start,v,h);while(!h.isEmpty()&&o.size()<g.size()-1){var e=h.pop();if(v[e.to()])continue;o.add(e);w+=e.weight();visit(g,e.to(),v,h);}return new SpanningTree(w,o);}private static void visit(List<List<Types.WeightedEdge>> g,int x,boolean[] v,data_structures.heaps.BinaryHeap.Heap<Types.Edge> h){v[x]=true;for(var e:g.get(x))if(!v[e.to()])h.push(new Types.Edge(x,e.to(),e.weight()));}
}
