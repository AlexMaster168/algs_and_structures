package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Dijkstra {
public record ShortestPaths(double[] distance,int[] parent){}public record PathResult(double distance,List<Integer> path){}private record Entry(int vertex,double distance){}public static ShortestPaths dijkstra(List<List<Types.WeightedEdge>> g,int source){double[] d=new double[g.size()];int[] p=new int[g.size()];Arrays.fill(d,Double.POSITIVE_INFINITY);Arrays.fill(p,-1);data_structures.heaps.BinaryHeap.Heap<Entry> h=new data_structures.heaps.BinaryHeap.Heap<>(Comparator.comparingDouble(Entry::distance));d[source]=0;h.push(new Entry(source,0));while(!h.isEmpty()){Entry e=h.pop();if(e.distance>d[e.vertex])continue;for(var n:g.get(e.vertex)){if(n.weight()<0)throw new IllegalArgumentException();double c=e.distance+n.weight();if(c<d[n.to()]){d[n.to()]=c;p[n.to()]=e.vertex;h.push(new Entry(n.to(),c));}}}return new ShortestPaths(d,p);}public static PathResult dijkstraPath(List<List<Types.WeightedEdge>> g,int s,int t){ShortestPaths r=dijkstra(g,s);return r.distance[t]==Double.POSITIVE_INFINITY?null:new PathResult(r.distance[t],Types.reconstructPath(r.parent,t));}
}
