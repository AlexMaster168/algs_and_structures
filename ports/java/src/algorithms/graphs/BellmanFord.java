package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BellmanFord {
public record BellmanFordResult(double[] distance,int[] parent,boolean hasNegativeCycle){}public static BellmanFordResult bellmanFord(int n,List<Types.Edge> edges,int source){double[] d=new double[n];int[] p=new int[n];Arrays.fill(d,Double.POSITIVE_INFINITY);Arrays.fill(p,-1);d[source]=0;for(int i=0;i<n-1;i++){boolean changed=false;for(var e:edges)if(d[e.from()]+e.weight()<d[e.to()]){d[e.to()]=d[e.from()]+e.weight();p[e.to()]=e.from();changed=true;}if(!changed)break;}boolean neg=false;for(var e:edges)if(d[e.from()]+e.weight()<d[e.to()])neg=true;return new BellmanFordResult(d,p,neg);}
}
