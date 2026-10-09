package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BubbleSort {
public static <T> List<T> bubbleSort(List<T> input) { return bubbleSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> bubbleSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); for(int e=a.size()-1;e>0;e--){boolean swap=false;for(int i=0;i<e;i++)if(c.compare(a.get(i),a.get(i+1))>0){Collections.swap(a,i,i+1);swap=true;}if(!swap)break;} return a; }
}
