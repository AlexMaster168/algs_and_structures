package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class ConnectedComponents {
public static List<List<Integer>> connectedComponents(List<List<Integer>> g){boolean[] v=new boolean[g.size()];List<List<Integer>> o=new ArrayList<>();for(int s=0;s<g.size();s++){if(v[s])continue;List<Integer> c=new ArrayList<>();Deque<Integer> st=new ArrayDeque<>();st.push(s);v[s]=true;while(!st.isEmpty()){int x=st.pop();c.add(x);for(int n:g.get(x))if(!v[n]){v[n]=true;st.push(n);}}o.add(algorithms.sorting.MergeSort.mergeSort(c));}return o;}
}
