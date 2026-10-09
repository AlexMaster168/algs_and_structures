package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class MergeSort {

public static <T> List<T> merge(List<T> l,List<T> r){return merge(l,r,shared.Compare::defaultCompare);}
public static <T> List<T> merge(List<T> l,List<T> r,Comparator<T> c){List<T> o=new ArrayList<>();int i=0,j=0;while(i<l.size()&&j<r.size())o.add(c.compare(l.get(i),r.get(j))<=0?l.get(i++):r.get(j++));while(i<l.size())o.add(l.get(i++));while(j<r.size())o.add(r.get(j++));return o;}
public static <T> List<T> mergeSort(List<T> a){return mergeSort(a,shared.Compare::defaultCompare);}
public static <T> List<T> mergeSort(List<T> a,Comparator<T> c){if(a.size()<2)return new ArrayList<>(a);int m=a.size()/2;return merge(mergeSort(a.subList(0,m),c),mergeSort(a.subList(m,a.size()),c),c);}
public static <T> List<T> bottomUpMergeSort(List<T> a){return bottomUpMergeSort(a,shared.Compare::defaultCompare);}
public static <T> List<T> bottomUpMergeSort(List<T> a,Comparator<T> c){List<T> s=new ArrayList<>(a),t=new ArrayList<>(Collections.nCopies(a.size(),null));for(int w=1;w<s.size();w*=2){for(int l=0;l<s.size();l+=2*w){int m=Math.min(l+w,s.size()),r=Math.min(l+2*w,s.size());List<T> b=merge(s.subList(l,m),s.subList(m,r),c);for(int i=0;i<b.size();i++)t.set(l+i,b.get(i));}List<T> b=s;s=t;t=b;}return s;}

}
