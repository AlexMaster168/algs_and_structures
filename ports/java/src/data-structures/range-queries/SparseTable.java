package data_structures.range_queries;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class SparseTable {
public static class Table<T>{private final List<List<T>> table=new ArrayList<>();private final int[] log;private final BinaryOperator<T> combine;public Table(List<T> a,BinaryOperator<T> c){combine=c;log=new int[a.size()+1];for(int i=2;i<log.length;i++)log[i]=log[i/2]+1;table.add(new ArrayList<>(a));for(int l=1;(1<<l)<=a.size();l++){List<T> p=table.get(l-1),r=new ArrayList<>();int half=1<<(l-1);for(int i=0;i+(1<<l)<=a.size();i++)r.add(c.apply(p.get(i),p.get(i+half)));table.add(r);}}public T query(int l,int r){if(l<0||r>=table.get(0).size()||l>r)throw new IndexOutOfBoundsException();int k=log[r-l+1];return combine.apply(table.get(k).get(l),table.get(k).get(r-(1<<k)+1));}}public static Table<Double> minSparseTable(List<Double> a){return new Table<>(a,Math::min);}public static Table<Double> maxSparseTable(List<Double> a){return new Table<>(a,Math::max);}
}
