package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Bipartite {
public static int[] bipartiteColoring(List<List<Integer>> g){int[] c=new int[g.size()];Arrays.fill(c,-1);for(int s=0;s<c.length;s++){if(c[s]!=-1)continue;c[s]=0;List<Integer> q=new ArrayList<>();q.add(s);for(int h=0;h<q.size();h++){int v=q.get(h);for(int n:g.get(v)){if(c[n]==-1){c[n]=1-c[v];q.add(n);}else if(c[n]==c[v])return null;}}}return c;}public static boolean isBipartite(List<List<Integer>> g){return bipartiteColoring(g)!=null;}
}
