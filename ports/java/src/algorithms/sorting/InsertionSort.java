package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class InsertionSort {
public static <T> List<T> insertionSort(List<T> input) { return insertionSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> insertionSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); insertionSortRange(a,0,a.size()-1,c); return a; }public static <T> void insertionSortRange(List<T> a,int l,int r,Comparator<T> c){for(int i=l+1;i<=r;i++){T v=a.get(i);int j=i-1;while(j>=l&&c.compare(a.get(j),v)>0){a.set(j+1,a.get(j));j--;}a.set(j+1,v);}}
}
