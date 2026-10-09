package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class MaxFlow {
public static double edmondsKarp(double[][] capacity,int source,int sink){if(source==sink)throw new IllegalArgumentException();int n=capacity.length;double[][] r=new double[n][];for(int i=0;i<n;i++)r[i]=capacity[i].clone();double flow=0;while(true){int[] p=new int[n];Arrays.fill(p,-1);p[source]=source;List<Integer> q=new ArrayList<>();q.add(source);for(int h=0;h<q.size()&&p[sink]==-1;h++){int v=q.get(h);for(int next=0;next<n;next++)if(p[next]==-1&&r[v][next]>0){p[next]=v;q.add(next);}}if(p[sink]==-1)return flow;double b=Double.POSITIVE_INFINITY;for(int v=sink;v!=source;v=p[v])b=Math.min(b,r[p[v]][v]);for(int v=sink;v!=source;v=p[v]){r[p[v]][v]-=b;r[v][p[v]]+=b;}flow+=b;}}
}
