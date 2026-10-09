package algorithms.trees;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LowestCommonAncestor {
private final int[] depth;private final int[][] up;private final int levels;public LowestCommonAncestor(List<List<Integer>> tree){this(tree,0);}public LowestCommonAncestor(List<List<Integer>> tree,int root){int n=tree.size();levels=Math.max(1,(int)Math.ceil(Math.log(n+1)/Math.log(2)));depth=new int[n];Arrays.fill(depth,-1);up=new int[levels][n];for(int[] row:up)Arrays.fill(row,root);List<Integer> q=new ArrayList<>();q.add(root);depth[root]=0;for(int h=0;h<q.size();h++){int v=q.get(h);for(int child:tree.get(v))if(depth[child]==-1){depth[child]=depth[v]+1;up[0][child]=v;q.add(child);}}for(int k=1;k<levels;k++)for(int v=0;v<n;v++)up[k][v]=up[k-1][up[k-1][v]];}public int ancestor(int v,int steps){for(int k=0;k<levels&&steps>0;k++,steps>>=1)if((steps&1)!=0)v=up[k][v];return v;}public int lca(int a,int b){if(depth[a]<depth[b]){int t=a;a=b;b=t;}a=ancestor(a,depth[a]-depth[b]);if(a==b)return a;for(int k=levels-1;k>=0;k--)if(up[k][a]!=up[k][b]){a=up[k][a];b=up[k][b];}return up[0][a];}public int distance(int a,int b){return depth[a]+depth[b]-2*depth[lca(a,b)];}
}
