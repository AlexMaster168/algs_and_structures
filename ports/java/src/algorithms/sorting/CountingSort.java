package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class CountingSort {
public static List<Integer> countingSort(List<Integer> a){if(a.isEmpty())return new ArrayList<>();int min=a.get(0),max=min;for(int v:a){min=Math.min(min,v);max=Math.max(max,v);}int[] counts=new int[Math.addExact(Math.subtractExact(max,min),1)];for(int v:a)counts[v-min]++;for(int i=1;i<counts.length;i++)counts[i]+=counts[i-1];List<Integer> out=new ArrayList<>(Collections.nCopies(a.size(),0));for(int i=a.size()-1;i>=0;i--){int v=a.get(i);out.set(--counts[v-min],v);}return out;}
}
