package data_structures.range_queries;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class FenwickTree {
private final double[] tree;public FenwickTree(int n){tree=new double[n+1];}public FenwickTree(double[] a){tree=new double[a.length+1];System.arraycopy(a,0,tree,1,a.length);for(int i=1;i<tree.length;i++){int p=i+(i&-i);if(p<tree.length)tree[p]+=tree[i];}}public int size(){return tree.length-1;}public void add(int i,double d){if(i<0||i>=size())throw new IndexOutOfBoundsException();for(i++;i<tree.length;i+=i&-i)tree[i]+=d;}public void set(int i,double v){add(i,v-rangeSum(i,i));}public double prefixSum(int i){double s=0;for(i=Math.min(i+1,size());i>0;i-=i&-i)s+=tree[i];return s;}public double rangeSum(int l,int r){return prefixSum(r)-(l>0?prefixSum(l-1):0);}
}
