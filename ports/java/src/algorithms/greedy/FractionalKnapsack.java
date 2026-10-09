package algorithms.greedy;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class FractionalKnapsack {
public static double fractionalKnapsack(List<algorithms.dynamic_programming.Knapsack.KnapsackItem> items,double cap){double value=0,remaining=cap;for(var i:algorithms.sorting.MergeSort.mergeSort(items,(a,b)->Double.compare(b.value()/b.weight(),a.value()/a.weight()))){if(remaining<=0)break;double take=Math.min(i.weight(),remaining);value+=i.value()/i.weight()*take;remaining-=take;}return value;}
}
