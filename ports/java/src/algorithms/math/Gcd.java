package algorithms.math;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Gcd {
public record Extended(long gcd,long x,long y){}public static long gcd(long a,long b){a=Math.abs(a);b=Math.abs(b);while(b!=0){long t=a%b;a=b;b=t;}return a;}public static long lcm(long a,long b){return a==0||b==0?0:Math.abs(a/gcd(a,b)*b);}public static Extended extendedGcd(long a,long b){if(b==0)return new Extended(a,1,0);Extended e=extendedGcd(b,a%b);return new Extended(e.gcd,e.y,e.x-Math.floorDiv(a,b)*e.y);}public static Long modInverse(long a,long m){Extended e=extendedGcd(Math.floorMod(a,m),m);return e.gcd==1?Math.floorMod(e.x,m):null;}
}
