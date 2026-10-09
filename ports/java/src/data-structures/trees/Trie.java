package data_structures.trees;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Trie {
private static class Node{Map<Integer,Node> children=new LinkedHashMap<>();boolean word;int pass;}private final Node root=new Node();private int count;public static Trie from(Iterable<String> words){Trie t=new Trie();for(String w:words)t.insert(w);return t;}public int size(){return count;}private Node walk(String s){Node n=root;for(int c:s.codePoints().toArray()){n=n.children.get(c);if(n==null)return null;}return n;}public boolean has(String s){Node n=walk(s);return n!=null&&n.word;}public boolean startsWith(String s){return walk(s)!=null;}public int countWithPrefix(String s){Node n=walk(s);return n==null?0:n.pass;}public boolean insert(String s){if(has(s))return false;Node n=root;n.pass++;for(int c:s.codePoints().toArray()){n=n.children.computeIfAbsent(c,k->new Node());n.pass++;}n.word=true;count++;return true;}public boolean delete(String s){if(!has(s))return false;Node n=root;n.pass--;for(int c:s.codePoints().toArray()){Node next=n.children.get(c);if(--next.pass==0){n.children.remove(c);count--;return true;}n=next;}n.word=false;count--;return true;}public List<String> wordsWithPrefix(String s){List<String> o=new ArrayList<>();Node n=walk(s);if(n!=null)collect(n,s,o);return o;}private void collect(Node n,String s,List<String> o){if(n.word)o.add(s);for(int c:algorithms.sorting.MergeSort.mergeSort(new ArrayList<>(n.children.keySet())))collect(n.children.get(c),s+new String(Character.toChars(c)),o);}
}
