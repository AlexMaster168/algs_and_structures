package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BridgesAndArticulationPoints {
public record CutStructure(List<int[]> bridges,List<Integer> articulationPoints){}public static CutStructure findBridgesAndArticulationPoints(List<List<Integer>> g){int[] entry=new int[g.size()],low=new int[g.size()],timer={0};Arrays.fill(entry,-1);boolean[] art=new boolean[g.size()];List<int[]> bridges=new ArrayList<>();for(int v=0;v<g.size();v++)if(entry[v]==-1)visit(g,v,-1,entry,low,timer,art,bridges);List<Integer> points=new ArrayList<>();for(int v=0;v<art.length;v++)if(art[v])points.add(v);bridges=algorithms.sorting.MergeSort.mergeSort(bridges,(a,b)->a[0]!=b[0]?Integer.compare(a[0],b[0]):Integer.compare(a[1],b[1]));return new CutStructure(bridges,points);}private static void visit(List<List<Integer>> g,int v,int p,int[] e,int[] low,int[] timer,boolean[] art,List<int[]> b){e[v]=low[v]=timer[0]++;int children=0;boolean skipped=false;for(int n:g.get(v)){if(n==p&&!skipped){skipped=true;continue;}if(e[n]!=-1){low[v]=Math.min(low[v],e[n]);continue;}visit(g,n,v,e,low,timer,art,b);children++;low[v]=Math.min(low[v],low[n]);if(low[n]>e[v])b.add(new int[]{Math.min(v,n),Math.max(v,n)});if(p!=-1&&low[n]>=e[v])art[v]=true;}if(p==-1&&children>1)art[v]=true;}
}
