package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class MaxSubarray {
public record Result(double sum,int start,int end){}public static Result maxSubarray(double[] a){if(a.length==0)throw new IllegalArgumentException();Result b=new Result(a[0],0,0);double sum=a[0];int start=0;for(int i=1;i<a.length;i++){if(sum<0){sum=a[i];start=i;}else sum+=a[i];if(sum>b.sum)b=new Result(sum,start,i);}return b;}
}
