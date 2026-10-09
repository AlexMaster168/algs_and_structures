package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BinarySearch {

public static <T> int binarySearch(List<T> a,T t){return binarySearch(a,t,shared.Compare::defaultCompare);}
public static <T> int binarySearch(List<T> a,T t,Comparator<T> c){return binarySearch(a,t,c,0,a.size()-1);}
public static <T> int binarySearch(List<T> a,T t,Comparator<T> c,int l,int h){while(l<=h){int m=l+(h-l)/2,o=c.compare(a.get(m),t);if(o==0)return m;if(o<0)l=m+1;else h=m-1;}return -1;}
public static <T> int binarySearchRecursive(List<T> a,T t){return binarySearchRecursive(a,t,shared.Compare::defaultCompare,0,a.size()-1);}
public static <T> int binarySearchRecursive(List<T> a,T t,Comparator<T> c){return binarySearchRecursive(a,t,c,0,a.size()-1);}
public static <T> int binarySearchRecursive(List<T> a,T t,Comparator<T> c,int l,int h){if(l>h)return -1;int m=l+(h-l)/2,o=c.compare(a.get(m),t);return o==0?m:o<0?binarySearchRecursive(a,t,c,m+1,h):binarySearchRecursive(a,t,c,l,m-1);}
public static <T> int lowerBound(List<T> a,T t){return lowerBound(a,t,shared.Compare::defaultCompare);}
public static <T> int lowerBound(List<T> a,T t,Comparator<T> c){int l=0,h=a.size();while(l<h){int m=(l+h)/2;if(c.compare(a.get(m),t)<0)l=m+1;else h=m;}return l;}
public static <T> int upperBound(List<T> a,T t){return upperBound(a,t,shared.Compare::defaultCompare);}
public static <T> int upperBound(List<T> a,T t,Comparator<T> c){int l=0,h=a.size();while(l<h){int m=(l+h)/2;if(c.compare(a.get(m),t)<=0)l=m+1;else h=m;}return l;}
public static int firstTrue(int l,int h,IntPredicate p){while(l<h){int m=l+(h-l)/2;if(p.test(m))h=m;else l=m+1;}return l;}

}
