package patterns.behavioral;
import java.util.*;
import java.util.function.Consumer;

public final class Observer {
    public static class Subject<T> {
        private final Set<Consumer<T>> observers=new LinkedHashSet<>();
        public int observerCount(){return observers.size();}
        public Runnable subscribe(Consumer<T> observer){observers.add(observer);return ()->observers.remove(observer);}
        public void notify(T value){for(var observer:new ArrayList<>(observers))observer.accept(value);}
    }
    public record PriceChange(String symbol,double price,double change) {}
    public static class StockTicker {
        public final Subject<PriceChange> changes=new Subject<>();private final Map<String,Double> prices=new HashMap<>();
        public void update(String symbol,double price){double previous=prices.getOrDefault(symbol,price);prices.put(symbol,price);changes.notify(new PriceChange(symbol,price,price-previous));}
    }
    public static class BehaviorSubject<T> extends Subject<T> {
        private T current;public BehaviorSubject(T value){current=value;}public T value(){return current;}
        public Runnable subscribe(Consumer<T> observer){observer.accept(current);return super.subscribe(observer);}
        public void notify(T value){current=value;super.notify(value);}
    }
}
