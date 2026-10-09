package patterns.architectural;
import java.util.*;
import java.util.function.Function;

public final class DependencyInjection {
    public static final class Token<T>{public final String description;private Token(String description){this.description=description;}}
    public static <T> Token<T> token(String description){return new Token<>(description);}
    private static class Registration<T>{Function<Container,T> factory;String lifetime;T instance;boolean initialized;Registration(Function<Container,T> factory,String lifetime){this.factory=factory;this.lifetime=lifetime;}}
    public static class Container {
        private final Map<Token<?>,Registration<?>> registrations=new HashMap<>();private final Set<Token<?>> resolving=new HashSet<>();
        public <T> Container register(Token<T> target,Function<Container,T> factory){return register(target,factory,"singleton");}
        public <T> Container register(Token<T> target,Function<Container,T> factory,String lifetime){if(!lifetime.equals("singleton")&&!lifetime.equals("transient"))throw new IllegalArgumentException();registrations.put(target,new Registration<>(factory,lifetime));return this;}
        public <T> Container value(Token<T> target,T value){var r=new Registration<T>(c->value,"singleton");r.instance=value;r.initialized=true;registrations.put(target,r);return this;}
        @SuppressWarnings("unchecked")
        public <T> T resolve(Token<T> target){var r=(Registration<T>)registrations.get(target);if(r==null)throw new IllegalStateException("No provider: "+target.description);if(r.lifetime.equals("singleton")&&r.initialized)return r.instance;if(!resolving.add(target))throw new IllegalStateException("Circular dependency: "+target.description);try{T result=r.factory.apply(this);if(r.lifetime.equals("singleton")){r.instance=result;r.initialized=true;}return result;}finally{resolving.remove(target);}}
    }
}
