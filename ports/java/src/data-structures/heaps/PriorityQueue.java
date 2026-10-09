package data_structures.heaps;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class PriorityQueue {
public static class QueueImpl<T>{private record Entry<T>(T value,double priority,long order){}private long counter;private final BinaryHeap.Heap<Entry<T>> heap=new BinaryHeap.Heap<>((a,b)->{int c=Double.compare(a.priority,b.priority);return c!=0?c:Long.compare(a.order,b.order);});public int size(){return heap.size();}public boolean isEmpty(){return heap.isEmpty();}public QueueImpl<T> enqueue(T v,double p){heap.push(new Entry<>(v,p,counter++));return this;}public T dequeue(){Entry<T> e=heap.pop();return e==null?null:e.value;}public T peek(){Entry<T> e=heap.peek();return e==null?null:e.value;}public Double peekPriority(){Entry<T> e=heap.peek();return e==null?null:e.priority;}}
}
