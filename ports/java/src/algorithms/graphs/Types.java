package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Types {
public record WeightedEdge(int to,double weight){}public record Edge(int from,int to,double weight){}public static List<Integer> reconstructPath(int[] parent,int target){List<Integer> o=new ArrayList<>();for(int v=target;v!=-1;v=parent[v])o.add(v);Collections.reverse(o);return o;}public static List<List<Integer>> toUndirected(int n,List<int[]> edges){List<List<Integer>> g=new ArrayList<>();for(int i=0;i<n;i++)g.add(new ArrayList<>());for(int[] e:edges){g.get(e[0]).add(e[1]);g.get(e[1]).add(e[0]);}return g;}public static List<List<WeightedEdge>> toWeightedUndirected(int n,List<Edge> edges){List<List<WeightedEdge>> g=new ArrayList<>();for(int i=0;i<n;i++)g.add(new ArrayList<>());for(Edge e:edges){g.get(e.from).add(new WeightedEdge(e.to,e.weight));g.get(e.to).add(new WeightedEdge(e.from,e.weight));}return g;}
}
