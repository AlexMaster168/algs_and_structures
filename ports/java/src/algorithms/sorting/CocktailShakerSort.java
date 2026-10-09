package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class CocktailShakerSort {
public static <T> List<T> cocktailShakerSort(List<T> input) { return cocktailShakerSort(input,shared.Compare::defaultCompare); }
public static <T> List<T> cocktailShakerSort(List<T> input,Comparator<T> c) { List<T> a=new ArrayList<>(input); int l=0,r=a.size()-1;boolean s=true;while(s&&l<r){s=false;for(int i=l;i<r;i++)if(c.compare(a.get(i),a.get(i+1))>0){Collections.swap(a,i,i+1);s=true;}r--;if(!s)break;s=false;for(int i=r-1;i>=l;i--)if(c.compare(a.get(i),a.get(i+1))>0){Collections.swap(a,i,i+1);s=true;}l++;} return a; }
}
