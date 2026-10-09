package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Bfs {
public record BfsResult(List<Integer> order,int[] distance,int[] parent){}public static BfsResult bfs(List<List<Integer>> g,int start){int[] d=new int[g.size()],p=new int[g.size()];Arrays.fill(d,-1);Arrays.fill(p,-1);List<Integer> q=new ArrayList<>(),o=new ArrayList<>();q.add(start);d[start]=0;for(int h=0;h<q.size();h++){int v=q.get(h);o.add(v);for(int n:g.get(v))if(d[n]==-1){d[n]=d[v]+1;p[n]=v;q.add(n);}}return new BfsResult(o,d,p);}public static List<Integer> shortestPathUnweighted(List<List<Integer>> g,int a,int b){BfsResult r=bfs(g,a);return r.distance[b]==-1?null:Types.reconstructPath(r.parent,b);}public static int gridShortestPath(List<String> g,int[] a,int[] b){return gridShortestPath(g,a,b,'#');}public static int gridShortestPath(List<String> g,int[] a,int[] b,char wall){int rows=g.size(),cols=rows==0?0:g.get(0).length();int[][] d=new int[rows][cols];for(int[] r:d)Arrays.fill(r,-1);List<int[]> q=new ArrayList<>();q.add(a);d[a[0]][a[1]]=0;int[][] dirs={{1,0},{-1,0},{0,1},{0,-1}};for(int h=0;h<q.size();h++){int[] v=q.get(h);if(v[0]==b[0]&&v[1]==b[1])return d[v[0]][v[1]];for(int[] dir:dirs){int r=v[0]+dir[0],c=v[1]+dir[1];if(r<0||c<0||r>=rows||c>=cols||g.get(r).charAt(c)==wall||d[r][c]!=-1)continue;d[r][c]=d[v[0]][v[1]]+1;q.add(new int[]{r,c});}}return -1;}
}
