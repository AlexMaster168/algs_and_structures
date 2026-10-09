package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SuffixArray {
public static List<Integer> suffixArray(String s){int n=s.length();int[] rank=new int[n];List<Integer> a=new ArrayList<>();for(int i=0;i<n;i++){rank[i]=s.charAt(i);a.add(i);}for(int k=1;n>0;k*=2){final int[] r=rank;final int w=k;a=algorithms.sorting.MergeSort.mergeSort(a,(i,j)->{int c=Integer.compare(r[i],r[j]);return c!=0?c:Integer.compare(i+w<n?r[i+w]:-1,j+w<n?r[j+w]:-1);});int[] next=new int[n];for(int i=1;i<n;i++){int p=a.get(i-1),c=a.get(i);next[c]=next[p]+(r[p]!=r[c]||(p+k<n?r[p+k]:-1)!=(c+k<n?r[c+k]:-1)?1:0);}rank=next;if(rank[a.get(n-1)]==n-1)break;}return a;}public static int[] lcpArray(String s,List<Integer> suffixes){int n=s.length();int[] rank=new int[n],lcp=new int[Math.max(0,n-1)];for(int i=0;i<n;i++)rank[suffixes.get(i)]=i;int h=0;for(int i=0;i<n;i++){if(rank[i]==0){h=0;continue;}int j=suffixes.get(rank[i]-1);while(i+h<n&&j+h<n&&s.charAt(i+h)==s.charAt(j+h))h++;lcp[rank[i]-1]=h;if(h>0)h--;}return lcp;}public static long countDistinctSubstrings(String s){long total=(long)s.length()*(s.length()+1)/2;for(int v:lcpArray(s,suffixArray(s)))total-=v;return total;}
}
