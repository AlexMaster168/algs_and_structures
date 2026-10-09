package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Kmp {
public static int[] prefixFunction(String s){int[] p=new int[s.length()];for(int i=1;i<p.length;i++){int k=p[i-1];while(k>0&&s.charAt(i)!=s.charAt(k))k=p[k-1];if(s.charAt(i)==s.charAt(k))k++;p[i]=k;}return p;}public static List<Integer> kmpSearch(String t,String p){List<Integer> o=new ArrayList<>();if(p.isEmpty())return o;int[] pi=prefixFunction(p);int k=0;for(int i=0;i<t.length();i++){while(k>0&&t.charAt(i)!=p.charAt(k))k=pi[k-1];if(t.charAt(i)==p.charAt(k))k++;if(k==p.length()){o.add(i-k+1);k=pi[k-1];}}return o;}
}
