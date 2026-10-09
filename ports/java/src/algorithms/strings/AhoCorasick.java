package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class AhoCorasick {
private static class Node{Map<Character,Integer> next=new LinkedHashMap<>();int fail;List<Integer> output=new ArrayList<>();}public record Match(String pattern,int index){}private final List<Node> nodes=new ArrayList<>();private final List<String> patterns;public AhoCorasick(List<String> patterns){this.patterns=new ArrayList<>(patterns);nodes.add(new Node());for(int i=0;i<patterns.size();i++){String p=patterns.get(i);if(p.isEmpty())continue;int s=0;for(int j=0;j<p.length();j++){char c=p.charAt(j);Integer next=nodes.get(s).next.get(c);if(next==null){next=nodes.size();nodes.add(new Node());nodes.get(s).next.put(c,next);}s=next;}nodes.get(s).output.add(i);}List<Integer> q=new ArrayList<>(nodes.get(0).next.values());for(int h=0;h<q.size();h++){int s=q.get(h);for(var e:nodes.get(s).next.entrySet()){int f=transition(nodes.get(s).fail,e.getKey());Node child=nodes.get(e.getValue());child.fail=f;child.output.addAll(nodes.get(f).output);q.add(e.getValue());}}}private int transition(int s,char c){while(true){Integer n=nodes.get(s).next.get(c);if(n!=null)return n;if(s==0)return 0;s=nodes.get(s).fail;}}public List<Match> search(String t){List<Match> o=new ArrayList<>();int s=0;for(int i=0;i<t.length();i++){s=transition(s,t.charAt(i));for(int p:nodes.get(s).output){String v=patterns.get(p);o.add(new Match(v,i-v.length()+1));}}return o;}
}
