package data_structures.range_queries;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SqrtDecomposition {
private final double[] values,sums;private final int block;public SqrtDecomposition(double[] a){values=a.clone();block=Math.max(1,(int)Math.ceil(Math.sqrt(a.length)));sums=new double[(a.length+block-1)/block];for(int i=0;i<a.length;i++)sums[i/block]+=a[i];}public void update(int i,double v){sums[i/block]+=v-values[i];values[i]=v;}public double rangeSum(int l,int r){double s=0;while(l<=r&&l%block!=0)s+=values[l++];while(l+block-1<=r){s+=sums[l/block];l+=block;}while(l<=r)s+=values[l++];return s;}
}
