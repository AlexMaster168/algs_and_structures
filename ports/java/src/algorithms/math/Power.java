package algorithms.math;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Power {
public static double fastPower(double b,int e){if(e<0)return 1/fastPower(b,-(long)e);return fastPower(b,(long)e);}private static double fastPower(double b,long e){double r=1;while(e>0){if((e&1)!=0)r*=b;b*=b;e/=2;}return r;}public static BigInteger modPow(BigInteger b,BigInteger e,BigInteger m){if(m.equals(BigInteger.ONE))return BigInteger.ZERO;BigInteger r=BigInteger.ONE;b=b.mod(m);while(e.signum()>0){if(e.testBit(0))r=r.multiply(b).mod(m);b=b.multiply(b).mod(m);e=e.shiftRight(1);}return r;}public static long integerSqrt(long n){if(n<0)throw new IllegalArgumentException();if(n<2)return n;long x=n,y=x/2+x%2;while(y<x){x=y;y=(x+n/x)/2;}return x;}public static double newtonSqrt(double n){return newtonSqrt(n,1e-12);}public static double newtonSqrt(double n,double e){if(n<0||e<=0)throw new IllegalArgumentException();if(n==0)return 0;double x=n;while(Math.abs(x*x-n)>e*n)x=(x+n/x)/2;return x;}
}
