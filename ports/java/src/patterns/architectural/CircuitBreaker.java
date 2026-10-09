package patterns.architectural;
import java.util.concurrent.*;
import java.util.function.*;

public class CircuitBreaker<A,R> {
    public static class CircuitOpenError extends IllegalStateException{public CircuitOpenError(){super("Circuit is open");}}
    private final Function<A,CompletableFuture<R>> action;private final int threshold;private final long timeout;private final LongSupplier now;private int failures;private long openedAt;private String current="closed";
    public CircuitBreaker(Function<A,CompletableFuture<R>> action){this(action,3,10000,System::currentTimeMillis);}
    public CircuitBreaker(Function<A,CompletableFuture<R>> action,int threshold,long timeout,LongSupplier now){this.action=action;this.threshold=threshold;this.timeout=timeout;this.now=now;}
    public synchronized String state(){if(current.equals("open")&&now.getAsLong()-openedAt>=timeout)current="half-open";return current;}
    public CompletableFuture<R> call(A argument){if(state().equals("open"))return CompletableFuture.failedFuture(new CircuitOpenError());CompletableFuture<R> result;try{result=action.apply(argument);}catch(Exception e){result=CompletableFuture.failedFuture(e);}return result.handle((value,error)->{synchronized(this){if(error==null){failures=0;current="closed";return value;}failures++;if(current.equals("half-open")||failures>=threshold){current="open";openedAt=now.getAsLong();}}throw new CompletionException(error);});}
    public static <R> CompletableFuture<R> retry(Supplier<CompletableFuture<R>> action,int attempts,long delayMs,double factor){if(attempts<1)return CompletableFuture.failedFuture(new IllegalArgumentException("Invalid attempts"));CompletableFuture<R> result;try{result=action.get();}catch(Exception e){result=CompletableFuture.failedFuture(e);}return result.handle((value,error)->{if(error==null)return CompletableFuture.completedFuture(value);if(attempts==1)return CompletableFuture.<R>failedFuture(error);return CompletableFuture.runAsync(()->{},CompletableFuture.delayedExecutor(delayMs,TimeUnit.MILLISECONDS)).thenCompose(ignored->retry(action,attempts-1,(long)(delayMs*factor),factor));}).thenCompose(Function.identity());}
}
