package data_structures.hashing;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class LRUCache {
public static class Cache<K,V>{public final int capacity;private final Map<K,data_structures.linear.DoublyLinkedList.DoublyLinkedListNode<Map.Entry<K,V>>> nodes=new HashMap<>();private final data_structures.linear.DoublyLinkedList.ListImpl<Map.Entry<K,V>> order=new data_structures.linear.DoublyLinkedList.ListImpl<>();public Cache(int capacity){if(capacity<=0)throw new IllegalArgumentException();this.capacity=capacity;}public int size(){return nodes.size();}private void touch(K k,V v){var n=nodes.get(k);if(n!=null)order.unlink(n);nodes.put(k,order.pushFront(new AbstractMap.SimpleEntry<>(k,v)));}public V get(K k){var n=nodes.get(k);if(n==null)return null;V v=n.value.getValue();touch(k,v);return v;}public boolean has(K k){return nodes.containsKey(k);}public Cache<K,V> set(K k,V v){touch(k,v);if(nodes.size()>capacity)nodes.remove(order.popBack().getKey());return this;}public boolean delete(K k){var n=nodes.remove(k);if(n==null)return false;order.unlink(n);return true;}public List<K> keys(){List<K> o=new ArrayList<>();for(var e:order)o.add(e.getKey());return o;}}
}
