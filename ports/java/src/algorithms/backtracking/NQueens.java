package algorithms.backtracking;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class NQueens {
public static List<List<String>> nQueens(int n){List<List<String>> o=new ArrayList<>();place(n,0,new int[n],new HashSet<>(),new HashSet<>(),new HashSet<>(),o);return o;}private static void place(int n,int r,int[] cols,Set<Integer> c,Set<Integer> d,Set<Integer> a,List<List<String>> o){if(r==n){List<String> b=new ArrayList<>();for(int x:cols)b.add(".".repeat(x)+"Q"+".".repeat(n-x-1));o.add(b);return;}for(int x=0;x<n;x++){if(c.contains(x)||d.contains(r-x)||a.contains(r+x))continue;cols[r]=x;c.add(x);d.add(r-x);a.add(r+x);place(n,r+1,cols,c,d,a,o);c.remove(x);d.remove(r-x);a.remove(r+x);}}public static long countNQueens(int n){if(n<0||n>31)throw new IllegalArgumentException();return count((1L<<n)-1,0,0,0);}private static long count(long full,long c,long d,long a){if(c==full)return 1;long total=0,free=full&~(c|d|a);while(free!=0){long b=free&-free;free^=b;total+=count(full,c|b,(d|b)<<1&full,(a|b)>>>1);}return total;}
}
