package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LongestCommonSubsequence {
public static String longestCommonSubsequence(String a,String b){int[][] t=new int[a.length()+1][b.length()+1];for(int i=1;i<=a.length();i++)for(int j=1;j<=b.length();j++)t[i][j]=a.charAt(i-1)==b.charAt(j-1)?t[i-1][j-1]+1:Math.max(t[i-1][j],t[i][j-1]);StringBuilder o=new StringBuilder();for(int i=a.length(),j=b.length();i>0&&j>0;)if(a.charAt(i-1)==b.charAt(j-1)){o.append(a.charAt(--i));j--;}else if(t[i-1][j]>=t[i][j-1])i--;else j--;return o.reverse().toString();}public static String longestCommonSubstring(String a,String b){int[] p=new int[b.length()+1];int best=0,end=0;for(int i=1;i<=a.length();i++){int[] c=new int[p.length];for(int j=1;j<c.length;j++)if(a.charAt(i-1)==b.charAt(j-1)){c[j]=p[j-1]+1;if(c[j]>best){best=c[j];end=i;}}p=c;}return a.substring(end-best,end);}
}
