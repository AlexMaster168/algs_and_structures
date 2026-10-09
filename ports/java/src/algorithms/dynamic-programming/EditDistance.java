package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class EditDistance {
public static int editDistance(String a,String b){int[] p=new int[b.length()+1];for(int j=0;j<p.length;j++)p[j]=j;for(int i=1;i<=a.length();i++){int[] c=new int[p.length];c[0]=i;for(int j=1;j<c.length;j++)c[j]=Math.min(Math.min(p[j]+1,c[j-1]+1),p[j-1]+(a.charAt(i-1)==b.charAt(j-1)?0:1));p=c;}return p[b.length()];}
}
