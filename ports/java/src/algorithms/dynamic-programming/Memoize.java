package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Memoize {
public static class Memoized<A,R> implements Function<A,R>{public final Map<Object,R> cache=new HashMap<>();private final Function<A,R> fn;private final Function<A,Object> key;public Memoized(Function<A,R> fn,Function<A,Object> key){this.fn=fn;this.key=key;}public R apply(A args){Object k=key.apply(args);if(cache.containsKey(k))return cache.get(k);R v=fn.apply(args);cache.put(k,v);return v;}}public static <A,R> Memoized<A,R> memoize(Function<A,R> fn){return new Memoized<>(fn,a->a);}public static <A,R> Memoized<A,R> memoize(Function<A,R> fn,Function<A,Object> key){return new Memoized<>(fn,key);}
}
