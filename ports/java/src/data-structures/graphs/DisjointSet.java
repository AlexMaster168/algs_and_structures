package data_structures.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class DisjointSet {
private final int[] parent,sizes;private int sets;public DisjointSet(int n){parent=new int[n];sizes=new int[n];sets=n;for(int i=0;i<n;i++){parent[i]=i;sizes[i]=1;}}public int count(){return sets;}public int find(int x){int r=x;while(parent[r]!=r)r=parent[r];while(parent[x]!=r){int next=parent[x];parent[x]=r;x=next;}return r;}public boolean union(int a,int b){a=find(a);b=find(b);if(a==b)return false;if(sizes[a]<sizes[b]){int t=a;a=b;b=t;}parent[b]=a;sizes[a]+=sizes[b];sets--;return true;}public boolean connected(int a,int b){return find(a)==find(b);}public int sizeOf(int x){return sizes[find(x)];}
}
