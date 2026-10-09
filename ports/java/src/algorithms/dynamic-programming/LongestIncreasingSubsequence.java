package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LongestIncreasingSubsequence {
public static List<Double> longestIncreasingSubsequence(double[] a){int[] tail=new int[a.length],p=new int[a.length];Arrays.fill(p,-1);int n=0;for(int i=0;i<a.length;i++){int l=0,h=n;while(l<h){int m=(l+h)/2;if(a[tail[m]]<a[i])l=m+1;else h=m;}if(l>0)p[i]=tail[l-1];tail[l]=i;if(l==n)n++;}List<Double> o=new ArrayList<>();for(int i=n>0?tail[n-1]:-1;i!=-1;i=p[i])o.add(a[i]);Collections.reverse(o);return o;}
}
