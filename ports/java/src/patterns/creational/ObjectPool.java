package patterns.creational;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class ObjectPool {
public static class Pool<T>{private final List<T> available=new ArrayList<>();private final Set<T> inUse=Collections.newSetFromMap(new IdentityHashMap<>());private final Supplier<T> create;private final Consumer<T> reset;private final int maxSize;public Pool(Supplier<T> create){this(create,x->{},Integer.MAX_VALUE);}public Pool(Supplier<T> c,Consumer<T> r,int max){create=c;reset=r;maxSize=max;}public int availableCount(){return available.size();}public int inUseCount(){return inUse.size();}public T acquire(){T item;if(available.isEmpty()){if(inUse.size()>=maxSize)throw new IllegalStateException("Pool is exhausted");item=create.get();}else item=available.remove(available.size()-1);inUse.add(item);return item;}public void release(T item){if(!inUse.remove(item))throw new IllegalArgumentException("Item does not belong to this pool");reset.accept(item);available.add(item);}public <R> R use(Function<T,R> work){T item=acquire();try{return work.apply(item);}finally{release(item);}}}
}
