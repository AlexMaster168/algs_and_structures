package data_structures.linear;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Deque {
public static class DequeImpl<T> implements Iterable<T>{private Object[] buffer;private int head,length;public DequeImpl(){this(8);}public DequeImpl(int capacity){buffer=new Object[Math.max(1,capacity)];}public int size(){return length;}public boolean isEmpty(){return length==0;}private void grow(){if(length<buffer.length)return;Object[] next=new Object[buffer.length*2];for(int i=0;i<length;i++)next[i]=buffer[(head+i)%buffer.length];buffer=next;head=0;}public DequeImpl<T> pushBack(T v){grow();buffer[(head+length++)%buffer.length]=v;return this;}public DequeImpl<T> pushFront(T v){grow();head=(head-1+buffer.length)%buffer.length;buffer[head]=v;length++;return this;}@SuppressWarnings("unchecked")private T value(int i){return (T)buffer[i];}public T popBack(){if(isEmpty())return null;int i=(head+--length)%buffer.length;T v=value(i);buffer[i]=null;return v;}public T popFront(){if(isEmpty())return null;T v=value(head);buffer[head]=null;head=(head+1)%buffer.length;length--;return v;}public T peekFront(){return isEmpty()?null:value(head);}public T peekBack(){return isEmpty()?null:value((head+length-1)%buffer.length);}public T at(int i){if(i<0)i+=length;return i<0||i>=length?null:value((head+i)%buffer.length);}public List<T> toArray(){List<T> o=new ArrayList<>();for(int i=0;i<length;i++)o.add(at(i));return o;}public Iterator<T> iterator(){return toArray().iterator();}}
}
