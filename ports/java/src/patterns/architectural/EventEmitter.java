package patterns.architectural;
import java.util.*;
import java.util.function.Consumer;

public final class EventEmitter {
    public static final class Event<T>{public final String name;public Event(String name){this.name=name;}}
    public static class TypedEventEmitter {
        private final Map<Event<?>,Set<Consumer<?>>> listeners=new HashMap<>();
        public <T> Runnable on(Event<T> event,Consumer<T> listener){listeners.computeIfAbsent(event,key->new LinkedHashSet<>()).add(listener);return ()->off(event,listener);}
        public <T> Runnable once(Event<T> event,Consumer<T> listener){class Once implements Consumer<T>{public void accept(T value){off(event,this);listener.accept(value);}}return on(event,new Once());}
        public <T> void off(Event<T> event,Consumer<T> listener){var set=listeners.get(event);if(set!=null)set.remove(listener);}
        @SuppressWarnings("unchecked")
        public <T> int emit(Event<T> event,T payload){var set=listeners.get(event);if(set==null)return 0;for(var listener:new ArrayList<>(set))((Consumer<T>)listener).accept(payload);return set.size();}
        public int listenerCount(Event<?> event){var set=listeners.get(event);return set==null?0:set.size();}
    }
}
