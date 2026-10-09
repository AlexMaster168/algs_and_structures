package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class EulerianPath {
public static List<Integer> eulerianPathDirected(List<List<Integer>> g){int n=g.size(),edges=0;int[] in=new int[n];for(var a:g){for(int v:a)in[v]++;edges+=a.size();}if(edges==0)return n>0?new ArrayList<>(List.of(0)):new ArrayList<>();int start=0,starts=0,ends=0;while(g.get(start).isEmpty())start++;for(int v=0;v<n;v++){int b=g.get(v).size()-in[v];if(b==1){starts++;start=v;}else if(b==-1)ends++;else if(b!=0)return null;}if(!(starts==0&&ends==0||starts==1&&ends==1))return null;int[] next=new int[n];Deque<Integer> st=new ArrayDeque<>();st.push(start);List<Integer> path=new ArrayList<>();while(!st.isEmpty()){int v=st.peek();if(next[v]<g.get(v).size())st.push(g.get(v).get(next[v]++));else path.add(st.pop());}if(path.size()!=edges+1)return null;Collections.reverse(path);return path;}
}
