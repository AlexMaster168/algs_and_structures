package patterns.architectural;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.function.*;

public final class Middleware {
    public interface Handler<C>{CompletableFuture<Void> handle(C context,Supplier<CompletableFuture<Void>> next);}
    public static <C> Function<C,CompletableFuture<Void>> compose(List<Handler<C>> middlewares){List<Handler<C>> chain=List.copyOf(middlewares);return context->{class Dispatch {int last=-1;CompletableFuture<Void> run(int index){if(index<=last)return CompletableFuture.failedFuture(new IllegalStateException("next() called multiple times"));last=index;if(index==chain.size())return CompletableFuture.completedFuture(null);try{return chain.get(index).handle(context,()->run(index+1));}catch(Exception e){return CompletableFuture.failedFuture(e);}}}return new Dispatch().run(0);};}
    public static class Pipeline<C>{private final List<Handler<C>> middlewares=new ArrayList<>();public Pipeline<C> use(Handler<C> handler){middlewares.add(handler);return this;}public CompletableFuture<Void> run(C context){return compose(middlewares).apply(context);}}
}
