package data_structures.hashing;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Hash {
public static long fnv1a(String s){return fnv1a(s,0x811c9dc5);}public static long fnv1a(String s,int seed){int h=seed;for(int i=0;i<s.length();i++){h^=s.charAt(i);h*=0x01000193;}return Integer.toUnsignedLong(h);}public static long defaultHasher(Object key){String type=key==null?"object":key instanceof String?"string":key instanceof Number?"number":key instanceof Boolean?"boolean":"object";return fnv1a(type+":"+String.valueOf(key));}
}
