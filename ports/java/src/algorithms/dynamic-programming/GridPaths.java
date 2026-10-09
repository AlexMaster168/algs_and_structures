package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class GridPaths {
public static long uniquePaths(int r,int c){return uniquePaths(r,c,new boolean[0][]);}public static long uniquePaths(int r,int c,boolean[][] blocked){if(c==0)return 0;long[] w=new long[c];w[0]=1;for(int i=0;i<r;i++)for(int j=0;j<c;j++){if(i<blocked.length&&j<blocked[i].length&&blocked[i][j])w[j]=0;else if(j>0)w[j]+=w[j-1];}return w[c-1];}public static double minPathSum(double[][] g){if(g.length==0||g[0].length==0)return Double.NaN;double[] b=new double[g[0].length];Arrays.fill(b,Double.POSITIVE_INFINITY);b[0]=0;for(double[] r:g)for(int c=0;c<b.length;c++)b[c]=r[c]+Math.min(b[c],c>0?b[c-1]:Double.POSITIVE_INFINITY);return b[b.length-1];}
}
