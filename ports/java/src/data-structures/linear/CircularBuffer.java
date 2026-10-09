package data_structures.linear;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class CircularBuffer {
public static class Buffer<T> implements Iterable<T>{public final int capacity;private final Object[] data;private int start,length;public Buffer(int capacity){if(capacity<=0)throw new IllegalArgumentException();this.capacity=capacity;data=new Object[capacity];}public int size(){return length;}public boolean isEmpty(){return length==0;}public boolean isFull(){return length==capacity;}@SuppressWarnings("unchecked")private T value(int i){return (T)data[i];}public T push(T v){if(isFull()){T old=value(start);data[start]=v;start=(start+1)%capacity;return old;}data[(start+length++)%capacity]=v;return null;}public T shift(){if(isEmpty())return null;T v=value(start);data[start]=null;start=(start+1)%capacity;length--;return v;}public List<T> toArray(){List<T> o=new ArrayList<>();for(int i=0;i<length;i++)o.add(value((start+i)%capacity));return o;}public Iterator<T> iterator(){return toArray().iterator();}}
}
