package data_structures.range_queries;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LazySegmentTree {
private final int n;private final double[] sums,pending;public LazySegmentTree(double[] a){n=a.length;sums=new double[4*Math.max(1,n)];pending=new double[sums.length];if(n>0)build(1,0,n-1,a);}public int size(){return n;}private void range(int l,int r){if(l<0||r>=n||l>r)throw new IndexOutOfBoundsException();}private void build(int x,int s,int e,double[] a){if(s==e){sums[x]=a[s];return;}int m=(s+e)/2;build(2*x,s,m,a);build(2*x+1,m+1,e,a);sums[x]=sums[2*x]+sums[2*x+1];}private void apply(int x,int s,int e,double d){sums[x]+=d*(e-s+1);pending[x]+=d;}private void push(int x,int s,int e){double d=pending[x];if(d==0)return;int m=(s+e)/2;apply(2*x,s,m,d);apply(2*x+1,m+1,e,d);pending[x]=0;}public void rangeAdd(int l,int r,double d){range(l,r);add(1,0,n-1,l,r,d);}private void add(int x,int s,int e,int l,int r,double d){if(r<s||e<l)return;if(l<=s&&e<=r){apply(x,s,e,d);return;}push(x,s,e);int m=(s+e)/2;add(2*x,s,m,l,r,d);add(2*x+1,m+1,e,l,r,d);sums[x]=sums[2*x]+sums[2*x+1];}public double rangeSum(int l,int r){range(l,r);return sum(1,0,n-1,l,r);}private double sum(int x,int s,int e,int l,int r){if(r<s||e<l)return 0;if(l<=s&&e<=r)return sums[x];push(x,s,e);int m=(s+e)/2;return sum(2*x,s,m,l,r)+sum(2*x+1,m+1,e,l,r);}
}
