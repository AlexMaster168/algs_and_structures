package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class ShellSort {
public static <T> List<T> shellSort(List<T> input) { return shellSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> shellSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); int gap=1;while(gap<a.size()/3)gap=gap*3+1;for(;gap>=1;gap=(gap-1)/3)for(int i=gap;i<a.size();i++){T v=a.get(i);int j=i;while(j>=gap&&c.compare(a.get(j-gap),v)>0){a.set(j,a.get(j-gap));j-=gap;}a.set(j,v);} return a; }
}
