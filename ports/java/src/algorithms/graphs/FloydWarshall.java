package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class FloydWarshall {
public record FloydWarshallResult(double[][] distance,int[][] next,boolean hasNegativeCycle){}public static FloydWarshallResult floydWarshall(double[][] w){int n=w.length;double[][] d=new double[n][];int[][] next=new int[n][n];for(int i=0;i<n;i++){d[i]=w[i].clone();for(int j=0;j<n;j++)next[i][j]=i==j||w[i][j]!=Double.POSITIVE_INFINITY?j:-1;if(d[i][i]>0)d[i][i]=0;}for(int k=0;k<n;k++)for(int i=0;i<n;i++){if(d[i][k]==Double.POSITIVE_INFINITY)continue;for(int j=0;j<n;j++){double c=d[i][k]+d[k][j];if(c<d[i][j]){d[i][j]=c;next[i][j]=next[i][k];}}}boolean neg=false;for(int i=0;i<n;i++)if(d[i][i]<0)neg=true;return new FloydWarshallResult(d,next,neg);}public static List<Integer> floydWarshallPath(int[][] next,int a,int b){if(next[a][b]==-1)return null;List<Integer> o=new ArrayList<>();o.add(a);while(a!=b){if(o.size()>next.length)throw new IllegalStateException("Cycle in path");a=next[a][b];o.add(a);}return o;}
}
