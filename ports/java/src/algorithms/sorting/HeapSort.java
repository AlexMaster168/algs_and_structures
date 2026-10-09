package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class HeapSort {
public static <T> List<T> heapSort(List<T> input) { return heapSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> heapSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); for(int i=a.size()/2-1;i>=0;i--)siftDown(a,i,a.size(),c);for(int e=a.size()-1;e>0;e--){Collections.swap(a,0,e);siftDown(a,0,e,c);} return a; }private static <T> void siftDown(List<T> a,int r,int end,Comparator<T> c){while(true){int l=2*r+1,b=r;if(l<end&&c.compare(a.get(l),a.get(b))>0)b=l;if(l+1<end&&c.compare(a.get(l+1),a.get(b))>0)b=l+1;if(b==r)return;Collections.swap(a,r,b);r=b;}}
}
