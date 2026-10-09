package algorithms.greedy;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class JumpGame {
public static boolean canReachEnd(int[] jumps){int far=0;for(int i=0;i<jumps.length;i++){if(i>far)return false;far=Math.max(far,i+jumps[i]);}return true;}public static int minJumps(int[] a){int count=0,end=0,far=0;for(int i=0;i<a.length-1;i++){far=Math.max(far,i+a[i]);if(i==end){if(far<=i)return -1;count++;end=far;}}return count;}public static List<Integer> greedyChange(int amount,List<Integer> denominations){List<Integer> o=new ArrayList<>();for(int c:algorithms.sorting.MergeSort.mergeSort(denominations,Comparator.reverseOrder())){if(c<=0)throw new IllegalArgumentException();while(amount>=c){o.add(c);amount-=c;}}return o;}
}
