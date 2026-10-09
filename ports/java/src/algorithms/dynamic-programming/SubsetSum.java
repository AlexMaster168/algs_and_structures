package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SubsetSum {
public static List<Integer> subsetSum(int[] a,int target){int[] p=new int[target+1];Arrays.fill(p,-1);boolean[] r=new boolean[target+1];r[0]=true;for(int i=0;i<a.length;i++)for(int s=target;s>=a[i];s--)if(!r[s]&&r[s-a[i]]){r[s]=true;p[s]=i;}if(!r[target])return null;List<Integer> o=new ArrayList<>();for(int s=target;s>0;s-=a[p[s]])o.add(a[p[s]]);Collections.reverse(o);return o;}public static boolean canPartition(int[] a){int s=0;for(int v:a)s+=v;return s%2==0&&subsetSum(a,s/2)!=null;}
}
