package data_structures.linear;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Stack {
public static class StackImpl<T> implements Iterable<T>{private final List<T> items=new ArrayList<>();public int size(){return items.size();}public boolean isEmpty(){return items.isEmpty();}public StackImpl<T> push(T v){items.add(v);return this;}public T pop(){return isEmpty()?null:items.remove(items.size()-1);}public T peek(){return isEmpty()?null:items.get(items.size()-1);}public List<T> toArray(){List<T> o=new ArrayList<>(items);Collections.reverse(o);return o;}public Iterator<T> iterator(){return toArray().iterator();}}
}
