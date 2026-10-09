package data_structures.range_queries;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SegmentTree {
public static class Tree<T>{private final int n;private final List<T> tree;private final BinaryOperator<T> combine;private final T identity;public Tree(List<T> a,BinaryOperator<T> c,T id){n=a.size();combine=c;identity=id;tree=new ArrayList<>(Collections.nCopies(2*n,id));for(int i=0;i<n;i++)tree.set(n+i,a.get(i));for(int i=n-1;i>0;i--)tree.set(i,c.apply(tree.get(2*i),tree.get(2*i+1)));}public int size(){return n;}private void index(int i){if(i<0||i>=n)throw new IndexOutOfBoundsException();}public T get(int i){index(i);return tree.get(n+i);}public void update(int i,T v){index(i);int p=n+i;tree.set(p,v);for(p>>=1;p>0;p>>=1)tree.set(p,combine.apply(tree.get(2*p),tree.get(2*p+1)));}public T query(int l,int r){if(l<0||r>=n||l>r)throw new IndexOutOfBoundsException();T a=identity,b=identity;for(l+=n,r+=n+1;l<r;l>>=1,r>>=1){if((l&1)!=0)a=combine.apply(a,tree.get(l++));if((r&1)!=0)b=combine.apply(tree.get(--r),b);}return combine.apply(a,b);}}public static Tree<Double> sumSegmentTree(List<Double> a){return new Tree<>(a,Double::sum,0.0);}public static Tree<Double> minSegmentTree(List<Double> a){return new Tree<>(a,Math::min,Double.POSITIVE_INFINITY);}public static Tree<Double> maxSegmentTree(List<Double> a){return new Tree<>(a,Math::max,Double.NEGATIVE_INFINITY);}
}
