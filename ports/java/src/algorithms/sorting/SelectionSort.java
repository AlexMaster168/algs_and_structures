package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SelectionSort {
public static <T> List<T> selectionSort(List<T> input) { return selectionSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> selectionSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); for(int i=0;i<a.size()-1;i++){int m=i;for(int j=i+1;j<a.size();j++)if(c.compare(a.get(j),a.get(m))<0)m=j;if(m!=i)Collections.swap(a,i,m);} return a; }
}
