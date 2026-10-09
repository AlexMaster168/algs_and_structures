package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LinearSearch {
public static <T> int linearSearch(List<T> a,T t){for(int i=0;i<a.size();i++)if(Objects.equals(a.get(i),t))return i;return -1;}public static <T> List<Integer> linearSearchAll(List<T> a,BiPredicate<T,Integer> p){List<Integer> o=new ArrayList<>();for(int i=0;i<a.size();i++)if(p.test(a.get(i),i))o.add(i);return o;}
}
