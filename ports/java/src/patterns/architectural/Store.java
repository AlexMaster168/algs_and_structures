package patterns.architectural;
import java.util.*;
import java.util.function.BiFunction;

public final class Store {
    public static class StateStore<S,A>{private S state;private final BiFunction<S,A,S> reducer;private final Set<Runnable> listeners=new LinkedHashSet<>();private boolean dispatching;public StateStore(BiFunction<S,A,S> reducer,S state){this.reducer=reducer;this.state=state;}public S getState(){return state;}public A dispatch(A action){if(dispatching)throw new IllegalStateException("Reducers may not dispatch actions");dispatching=true;try{state=reducer.apply(state,action);}finally{dispatching=false;}for(var listener:new ArrayList<>(listeners))listener.run();return action;}public Runnable subscribe(Runnable listener){listeners.add(listener);return ()->listeners.remove(listener);}}
    public static <S,A> StateStore<S,A> createStore(BiFunction<S,A,S> reducer,S state){return new StateStore<>(reducer,state);}
    public static <A> BiFunction<Map<String,Object>,A,Map<String,Object>> combineReducers(Map<String,BiFunction<Object,A,Object>> reducers){return (state,action)->{Map<String,Object> next=new LinkedHashMap<>();boolean changed=false;for(var e:reducers.entrySet()){Object value=e.getValue().apply(state.get(e.getKey()),action);next.put(e.getKey(),value);changed|=value!=state.get(e.getKey());}return changed?next:state;};}
    public record CounterAction(String type,double amount){public CounterAction(String type){this(type,0);}}
    public static Double counterReducer(Double state,CounterAction action){return switch(action.type()){case "increment"->state+1;case "decrement"->state-1;case "add"->state+action.amount();default->throw new IllegalArgumentException();};}
}
