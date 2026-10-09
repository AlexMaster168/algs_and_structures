package data_structures.linear;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Queue {
public static class QueueImpl<T> implements Iterable<T>{private List<T> items=new ArrayList<>();private int head;public int size(){return items.size()-head;}public boolean isEmpty(){return size()==0;}public QueueImpl<T> enqueue(T v){items.add(v);return this;}public T dequeue(){if(isEmpty())return null;T v=items.get(head++);if(head*2>=items.size()){items=new ArrayList<>(items.subList(head,items.size()));head=0;}return v;}public T peek(){return isEmpty()?null:items.get(head);}public List<T> toArray(){return new ArrayList<>(items.subList(head,items.size()));}public Iterator<T> iterator(){return toArray().iterator();}}
}
