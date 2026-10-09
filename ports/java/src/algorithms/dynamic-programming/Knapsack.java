package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Knapsack {
public record KnapsackItem(int weight,double value){}public record Result(double value,List<Integer> items){}public static Result knapsack01(List<KnapsackItem> a,int cap){double[][] t=new double[a.size()+1][cap+1];for(int i=1;i<=a.size();i++){KnapsackItem x=a.get(i-1);for(int w=0;w<=cap;w++){t[i][w]=t[i-1][w];if(x.weight<=w)t[i][w]=Math.max(t[i][w],t[i-1][w-x.weight]+x.value);}}List<Integer> chosen=new ArrayList<>();for(int i=a.size(),w=cap;i>0;i--)if(t[i][w]!=t[i-1][w]){chosen.add(i-1);w-=a.get(i-1).weight;}Collections.reverse(chosen);return new Result(t[a.size()][cap],chosen);}public static double unboundedKnapsack(List<KnapsackItem> a,int cap){double[] b=new double[cap+1];for(int w=1;w<=cap;w++)for(KnapsackItem x:a)if(x.weight<=w)b[w]=Math.max(b[w],b[w-x.weight]+x.value);return b[cap];}
}
