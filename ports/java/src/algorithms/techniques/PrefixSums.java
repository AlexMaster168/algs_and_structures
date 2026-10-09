package algorithms.techniques;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class PrefixSums {
private final double[] prefix;public PrefixSums(double[] a){prefix=new double[a.length+1];for(int i=0;i<a.length;i++)prefix[i+1]=prefix[i]+a[i];}public double sum(int l,int r){return prefix[r+1]-prefix[l];}public static class PrefixSums2D{private final double[][] p;public PrefixSums2D(double[][] a){int rows=a.length,cols=rows==0?0:a[0].length;p=new double[rows+1][cols+1];for(int r=0;r<rows;r++)for(int c=0;c<cols;c++)p[r+1][c+1]=a[r][c]+p[r][c+1]+p[r+1][c]-p[r][c];}public double sum(int t,int l,int b,int r){return p[b+1][r+1]-p[t][r+1]-p[b+1][l]+p[t][l];}}public static long subarraySumEquals(double[] a,double target){Map<Double,Integer> seen=new HashMap<>();seen.put(0.0,1);double s=0;long count=0;for(double v:a){s+=v;count+=seen.getOrDefault(s-target,0);seen.merge(s,1,Integer::sum);}return count;}public record Update(int left,int right,double delta){}public static double[] differenceArrayApply(int n,List<Update> updates){double[] d=new double[n+1],o=new double[n];for(Update u:updates){d[u.left]+=u.delta;d[u.right+1]-=u.delta;}double s=0;for(int i=0;i<n;i++)o[i]=s+=d[i];return o;}public static Double majorityElement(double[] a){Double candidate=null;int c=0;for(double v:a){if(c==0)candidate=v;c+=candidate==v?1:-1;}c=0;for(double v:a)if(candidate!=null&&v==candidate)c++;return c>a.length/2?candidate:null;}
}
