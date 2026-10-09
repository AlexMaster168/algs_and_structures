package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class QuickSelect {
public static <T> T quickSelect(List<T> a,int k){return quickSelect(a,k,shared.Compare::defaultCompare);}public static <T> T quickSelect(List<T> input,int k,Comparator<T> c){if(k<0||k>=input.size())throw new IndexOutOfBoundsException();List<T> a=new ArrayList<>(input);int l=0,h=a.size()-1;while(true){int p=l+java.util.concurrent.ThreadLocalRandom.current().nextInt(h-l+1);Collections.swap(a,p,h);p=algorithms.sorting.QuickSort.lomutoPartition(a,l,h,c);if(p==k)return a.get(p);if(p<k)l=p+1;else h=p-1;}}public static double median(List<Double> a){if(a.isEmpty())throw new IllegalArgumentException();int m=a.size()/2;return a.size()%2==1?quickSelect(a,m):(quickSelect(a,m-1)+quickSelect(a,m))/2;}
}
