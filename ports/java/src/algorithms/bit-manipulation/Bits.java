package algorithms.bit_manipulation;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Bits {
public static int getBit(int v,int p){return v>>>p&1;}public static long setBit(int v,int p){return Integer.toUnsignedLong(v|1<<p);}public static long clearBit(int v,int p){return Integer.toUnsignedLong(v&~(1<<p));}public static long toggleBit(int v,int p){return Integer.toUnsignedLong(v^1<<p);}public static int countSetBits(int v){int c=0;for(;v!=0;v&=v-1)c++;return c;}public static boolean isPowerOfTwo(int v){return v>0&&(v&(v-1))==0;}public static int lowestSetBit(int v){return v&-v;}public static int singleNumber(int[] a){int r=0;for(int v:a)r^=v;return r;}public static long reverseBits(int v){int r=0;for(int i=0;i<32;i++){r=r<<1|v&1;v>>>=1;}return Integer.toUnsignedLong(r);}public static int[] grayCode(int b){int[] a=new int[1<<b];for(int i=0;i<a.length;i++)a[i]=i^(i>>1);return a;}public static <T> List<List<T>> subsetsByMask(List<T> a){List<List<T>> o=new ArrayList<>();for(int m=0;m<(1<<a.size());m++){List<T> s=new ArrayList<>();for(int i=0;i<a.size();i++)if((m&(1<<i))!=0)s.add(a.get(i));o.add(s);}return o;}public static int[] swapWithoutTemp(int a,int b){a^=b;b^=a;a^=b;return new int[]{a,b};}public static int hammingDistance(int a,int b){return countSetBits(a^b);}
}
