package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class JumpSearch {
public static int jumpSearch(double[] a,double t){int n=a.length;if(n==0)return -1;int s=(int)Math.sqrt(n),p=0,c=s;while(c<n&&a[c-1]<t){p=c;c+=s;}for(int i=p;i<Math.min(c,n);i++)if(a[i]==t)return i;return -1;}
}
