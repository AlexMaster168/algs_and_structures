package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class WordBreak {
public static List<String> wordBreak(String s,Iterable<String> dict){Set<String> w=new HashSet<>();int max=0;for(String x:dict){w.add(x);max=Math.max(max,x.length());}boolean[] r=new boolean[s.length()+1];int[] p=new int[r.length];r[0]=true;for(int e=1;e<r.length;e++)for(int b=Math.max(0,e-max);b<e;b++)if(r[b]&&w.contains(s.substring(b,e))){r[e]=true;p[e]=b;break;}if(!r[s.length()])return null;List<String> o=new ArrayList<>();for(int e=s.length();e>0;e=p[e])o.add(s.substring(p[e],e));Collections.reverse(o);return o;}
}
