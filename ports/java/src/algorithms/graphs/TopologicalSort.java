package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class TopologicalSort {
public static List<Integer> topologicalSortKahn(List<List<Integer>> g){int[] d=new int[g.size()];for(var n:g)for(int v:n)d[v]++;List<Integer> q=new ArrayList<>(),o=new ArrayList<>();for(int i=0;i<d.length;i++)if(d[i]==0)q.add(i);for(int h=0;h<q.size();h++){int v=q.get(h);o.add(v);for(int n:g.get(v))if(--d[n]==0)q.add(n);}return o.size()==g.size()?o:null;}public static List<Integer> topologicalSortDfs(List<List<Integer>> g){int[] state=new int[g.size()];List<Integer> o=new ArrayList<>();for(int i=0;i<state.length;i++)if(state[i]==0&&!visit(g,i,state,o))return null;Collections.reverse(o);return o;}private static boolean visit(List<List<Integer>> g,int v,int[] s,List<Integer> o){s[v]=1;for(int n:g.get(v)){if(s[n]==1)return false;if(s[n]==0&&!visit(g,n,s,o))return false;}s[v]=2;o.add(v);return true;}
}
