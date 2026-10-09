package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Fibonacci {
public static long fibonacciRecursive(int n){return n<2?n:fibonacciRecursive(n-1)+fibonacciRecursive(n-2);}private static final Map<Integer,Long> cache=new HashMap<>();public static synchronized long fibonacciMemo(int n){if(cache.containsKey(n))return cache.get(n);long v=n<2?n:fibonacciMemo(n-1)+fibonacciMemo(n-2);cache.put(n,v);return v;}public static BigInteger fibonacci(int n){BigInteger a=BigInteger.ZERO,b=BigInteger.ONE;if(n==0)return a;for(int i=1;i<n;i++){BigInteger c=a.add(b);a=b;b=c;}return b;}public static BigInteger fibonacciFast(int n){return pair(n)[0];}private static BigInteger[] pair(int n){if(n==0)return new BigInteger[]{BigInteger.ZERO,BigInteger.ONE};BigInteger[] p=pair(n/2);BigInteger a=p[0],b=p[1],c=a.multiply(b.shiftLeft(1).subtract(a)),d=a.multiply(a).add(b.multiply(b));return n%2==0?new BigInteger[]{c,d}:new BigInteger[]{d,c.add(d)};}
}
