package patterns.creational;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Singleton {
public static final class AppConfig{private static final AppConfig INSTANCE=new AppConfig();private final Map<String,String> values=new HashMap<>();private AppConfig(){}public static AppConfig getInstance(){return INSTANCE;}public AppConfig set(String k,String v){values.put(k,v);return this;}public String get(String k){return get(k,null);}public String get(String k,String fallback){return values.getOrDefault(k,fallback);}}public static <T> Supplier<T> lazySingleton(Supplier<T> create){return new Supplier<>(){boolean initialized;T value;public synchronized T get(){if(!initialized){value=create.get();initialized=true;}return value;}};}
}
