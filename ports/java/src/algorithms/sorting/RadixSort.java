package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class RadixSort {
public static List<Integer> radixSort(List<Integer> a){return radixSort(a,10);}public static List<Integer> radixSort(List<Integer> a,int base){if(base<2)throw new IllegalArgumentException();List<Long> neg=new ArrayList<>(),pos=new ArrayList<>();for(int v:a)(v<0?neg:pos).add(v<0?-(long)v:(long)v);neg=nonNegative(neg,base);pos=nonNegative(pos,base);List<Integer> o=new ArrayList<>();for(int i=neg.size()-1;i>=0;i--)o.add((int)-neg.get(i));for(long v:pos)o.add((int)v);return o;}private static List<Long> nonNegative(List<Long> a,int base){long max=0;for(long v:a)max=Math.max(max,v);for(long e=1;max/e>0;e*=base){List<List<Long>> b=new ArrayList<>();for(int i=0;i<base;i++)b.add(new ArrayList<>());for(long v:a)b.get((int)(v/e%base)).add(v);a=new ArrayList<>();for(List<Long> x:b)a.addAll(x);if(e>max/base)break;}return a;}
}
