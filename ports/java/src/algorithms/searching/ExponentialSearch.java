package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class ExponentialSearch {
public static <T> int exponentialSearch(List<T> a,T t){return exponentialSearch(a,t,shared.Compare::defaultCompare);}public static <T> int exponentialSearch(List<T> a,T t,Comparator<T> c){if(a.isEmpty())return -1;if(c.compare(a.get(0),t)==0)return 0;int b=1;while(b<a.size()&&c.compare(a.get(b),t)<0)b*=2;return BinarySearch.binarySearch(a,t,c,b/2,Math.min(b,a.size()-1));}
}
