package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Dfs {
public static List<Integer> dfs(List<List<Integer>> g,int s){boolean[] v=new boolean[g.size()];List<Integer> o=new ArrayList<>();Deque<Integer> st=new ArrayDeque<>();st.push(s);while(!st.isEmpty()){int x=st.pop();if(v[x])continue;v[x]=true;o.add(x);List<Integer> n=g.get(x);for(int i=n.size()-1;i>=0;i--)if(!v[n.get(i)])st.push(n.get(i));}return o;}public static List<Integer> dfsRecursive(List<List<Integer>> g,int s){List<Integer> o=new ArrayList<>();visit(g,s,new boolean[g.size()],o);return o;}private static void visit(List<List<Integer>> g,int s,boolean[] v,List<Integer> o){v[s]=true;o.add(s);for(int n:g.get(s))if(!v[n])visit(g,n,v,o);}public static boolean hasPath(List<List<Integer>> g,int a,int b){return dfs(g,a).contains(b);}
}
