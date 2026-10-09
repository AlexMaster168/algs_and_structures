package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class RodCutting {
public record Result(double revenue,List<Integer> pieces){}public static Result rodCutting(double[] p,int n){double[] r=new double[n+1];int[] f=new int[n+1];for(int t=1;t<=n;t++)for(int x=1;x<=Math.min(t,p.length);x++){double v=p[x-1]+r[t-x];if(v>r[t]){r[t]=v;f[t]=x;}}List<Integer> o=new ArrayList<>();for(int t=n;t>0&&f[t]>0;t-=f[t])o.add(f[t]);return new Result(r[n],o);}
}
