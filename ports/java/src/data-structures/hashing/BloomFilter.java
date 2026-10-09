package data_structures.hashing;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BloomFilter {
public final int bitCount,hashCount;private final byte[] bits;public BloomFilter(int items){this(items,.01);}public BloomFilter(int items,double rate){if(items<=0||rate<=0||rate>=1)throw new IllegalArgumentException();bitCount=Math.max(8,(int)Math.ceil(-items*Math.log(rate)/Math.pow(Math.log(2),2)));hashCount=Math.max(1,(int)Math.round((double)bitCount/items*Math.log(2)));bits=new byte[(bitCount+7)/8];}private int[] positions(String s){long a=Hash.fnv1a(s),b=Hash.fnv1a(s,0x5bd1e995)|1;int[] o=new int[hashCount];for(int i=0;i<o.length;i++)o[i]=(int)((a+i*b)%bitCount);return o;}public BloomFilter add(String s){for(int p:positions(s))bits[p>>3]|=1<<(p&7);return this;}public boolean mightContain(String s){for(int p:positions(s))if((bits[p>>3]&(1<<(p&7)))==0)return false;return true;}
}
