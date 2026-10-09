package algorithms.math;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Combinatorics {
public static BigInteger factorial(int n){if(n<0)throw new IllegalArgumentException();BigInteger r=BigInteger.ONE;for(int i=2;i<=n;i++)r=r.multiply(BigInteger.valueOf(i));return r;}public static BigInteger binomial(int n,int k){if(k<0||k>n)return BigInteger.ZERO;k=Math.min(k,n-k);BigInteger r=BigInteger.ONE;for(int i=1;i<=k;i++)r=r.multiply(BigInteger.valueOf(n-k+i)).divide(BigInteger.valueOf(i));return r;}public static BigInteger catalan(int n){return binomial(2*n,n).divide(BigInteger.valueOf(n+1));}public static List<List<Long>> pascalTriangle(int n){List<List<Long>> o=new ArrayList<>();for(int r=0;r<n;r++){List<Long> row=new ArrayList<>();row.add(1L);for(int c=1;c<r;c++)row.add(o.get(r-1).get(c-1)+o.get(r-1).get(c));if(r>0)row.add(1L);o.add(row);}return o;}public static boolean nextPermutation(List<Integer> a){int i=a.size()-2;while(i>=0&&a.get(i)>=a.get(i+1))i--;if(i<0){Collections.reverse(a);return false;}int j=a.size()-1;while(a.get(j)<=a.get(i))j--;Collections.swap(a,i,j);for(int l=i+1,r=a.size()-1;l<r;l++,r--)Collections.swap(a,l,r);return true;}
}
