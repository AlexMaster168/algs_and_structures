package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class BoyerMooreHorspool {
public static List<Integer> boyerMooreHorspool(String t,String p){int m=p.length();List<Integer> o=new ArrayList<>();if(m==0||m>t.length())return o;Map<Character,Integer> shift=new HashMap<>();for(int i=0;i<m-1;i++)shift.put(p.charAt(i),m-1-i);int pos=0;while(pos<=t.length()-m){int j=m-1;while(j>=0&&t.charAt(pos+j)==p.charAt(j))j--;if(j<0)o.add(pos);pos+=shift.getOrDefault(t.charAt(pos+m-1),m);}return o;}
}
