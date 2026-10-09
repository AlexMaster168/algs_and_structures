package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class MatrixChain {
public record Result(double cost,String order){}public static Result matrixChainOrder(int[] d){int n=d.length-1;if(n<1)return new Result(0,"");double[][] c=new double[n][n];int[][] s=new int[n][n];for(int len=2;len<=n;len++)for(int i=0;i+len-1<n;i++){int j=i+len-1;c[i][j]=Double.POSITIVE_INFINITY;for(int k=i;k<j;k++){double v=c[i][k]+c[k+1][j]+(double)d[i]*d[k+1]*d[j+1];if(v<c[i][j]){c[i][j]=v;s[i][j]=k;}}}return new Result(c[0][n-1],render(s,0,n-1));}private static String render(int[][] s,int i,int j){return i==j?"A"+(i+1):"("+render(s,i,s[i][j])+render(s,s[i][j]+1,j)+")";}
}
