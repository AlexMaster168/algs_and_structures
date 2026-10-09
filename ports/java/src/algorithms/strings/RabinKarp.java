package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class RabinKarp {
public static List<Integer> rabinKarp(String t,String p){List<Integer> o=new ArrayList<>();int m=p.length();if(m==0||m>t.length())return o;long mod=1000000007,power=1,ph=0,wh=0;for(int i=1;i<m;i++)power=power*256%mod;for(int i=0;i<m;i++){ph=(ph*256+p.charAt(i))%mod;wh=(wh*256+t.charAt(i))%mod;}for(int s=0;;s++){if(ph==wh&&t.startsWith(p,s))o.add(s);if(s+m>=t.length())break;wh=(wh-t.charAt(s)*power%mod+mod)%mod;wh=(wh*256+t.charAt(s+m))%mod;}return o;}
}
