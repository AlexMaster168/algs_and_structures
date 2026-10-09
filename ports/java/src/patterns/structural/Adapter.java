package patterns.structural;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Adapter {
public interface TemperatureSensor{double celsius();}public static class LegacyFahrenheitSensor{private final double reading;public LegacyFahrenheitSensor(double r){reading=r;}public double readFahrenheit(){return reading;}}public static class FahrenheitSensorAdapter implements TemperatureSensor{private final LegacyFahrenheitSensor legacy;public FahrenheitSensorAdapter(LegacyFahrenheitSensor legacy){this.legacy=legacy;}public double celsius(){return Math.round((legacy.readFahrenheit()-32)*5/9*10)/10.0;}}public static double averageTemperature(List<TemperatureSensor> sensors){double sum=0;for(var s:sensors)sum+=s.celsius();return sum/sensors.size();}public interface NodeCallback<T>{void accept(Throwable error,T result);}public interface CallbackFunction<A,T>{void call(A args,NodeCallback<T> callback);}public static <A,T> Function<A,java.util.concurrent.CompletableFuture<T>> promisify(CallbackFunction<A,T> fn){return args->{var future=new java.util.concurrent.CompletableFuture<T>();try{fn.call(args,(error,result)->{if(error!=null)future.completeExceptionally(error);else future.complete(result);});}catch(Throwable e){future.completeExceptionally(e);}return future;};}
}
