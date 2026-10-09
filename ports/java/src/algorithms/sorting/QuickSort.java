package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class QuickSort {
public static <T> List<T> quickSort(List<T> input) { return quickSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> quickSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); Deque<int[]> stack=new ArrayDeque<>();stack.push(new int[]{0,a.size()-1});while(!stack.isEmpty()){int[] x=stack.pop();if(x[0]>=x[1])continue;int[] p=partition3(a,x[0],x[1],c);stack.push(new int[]{x[0],p[0]-1});stack.push(new int[]{p[1]+1,x[1]});} return a; }public static <T> int[] partition3(List<T> a,int l,int h,Comparator<T> c){T p=a.get(l+java.util.concurrent.ThreadLocalRandom.current().nextInt(h-l+1));int lt=l,gt=h,i=l;while(i<=gt){int o=c.compare(a.get(i),p);if(o<0)Collections.swap(a,lt++,i++);else if(o>0)Collections.swap(a,i,gt--);else i++;}return new int[]{lt,gt};}
public static <T> int lomutoPartition(List<T> a,int l,int h,Comparator<T> c){T p=a.get(h);int b=l;for(int i=l;i<h;i++)if(c.compare(a.get(i),p)<0)Collections.swap(a,b++,i);Collections.swap(a,b,h);return b;}
public static <T> List<T> quickSortFunctional(List<T> a){return quickSortFunctional(a,shared.Compare::defaultCompare);}
public static <T> List<T> quickSortFunctional(List<T> a,Comparator<T> c){if(a.size()<2)return new ArrayList<>(a);T p=a.get(0);List<T> l=new ArrayList<>(),r=new ArrayList<>();for(int i=1;i<a.size();i++)(c.compare(a.get(i),p)<0?l:r).add(a.get(i));List<T> out=quickSortFunctional(l,c);out.add(p);out.addAll(quickSortFunctional(r,c));return out;}
}
