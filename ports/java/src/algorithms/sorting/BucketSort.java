package algorithms.sorting;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BucketSort {
public static List<Double> bucketSort(List<Double> a){return bucketSort(a,Math.max(1,(int)Math.round(Math.sqrt(a.size()))));}public static List<Double> bucketSort(List<Double> a,int n){if(n<1)throw new IllegalArgumentException();if(a.size()<2)return new ArrayList<>(a);double min=a.get(0),max=min;for(double v:a){min=Math.min(min,v);max=Math.max(max,v);}if(min==max)return new ArrayList<>(a);List<List<Double>> b=new ArrayList<>();for(int i=0;i<n;i++)b.add(new ArrayList<>());double range=(max-min)/n;for(double v:a)b.get(Math.min(n-1,(int)((v-min)/range))).add(v);List<Double> o=new ArrayList<>();for(List<Double> x:b)o.addAll(InsertionSort.insertionSort(x));return o;}
}
