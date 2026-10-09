package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class TimSort {
public static <T> List<T> timSort(List<T> input) { return timSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> timSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); int n=a.size(),v=n,r=0;while(v>=32){r|=v&1;v>>=1;}int run=v+r;if(n>0){for(int s=0;s<n;s+=run)InsertionSort.insertionSortRange(a,s,Math.min(s+run-1,n-1),c);for(int size=run;size<n;size*=2)for(int l=0;l<n;l+=2*size){int m=Math.min(l+size,n),e=Math.min(l+2*size,n);List<T> b=MergeSort.merge(a.subList(l,m),a.subList(m,e),c);for(int i=0;i<b.size();i++)a.set(l+i,b.get(i));}} return a; }
}
