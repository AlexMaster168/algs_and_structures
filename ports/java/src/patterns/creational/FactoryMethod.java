package patterns.creational;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class FactoryMethod {
public interface Transport{String kind();String deliver(String cargo);}public static class Truck implements Transport{public String kind(){return "truck";}public String deliver(String cargo){return "Truck delivers "+cargo+" by road";}}public static class Ship implements Transport{public String kind(){return "ship";}public String deliver(String cargo){return "Ship delivers "+cargo+" by sea";}}public abstract static class Logistics{protected abstract Transport createTransport();public String planDelivery(String cargo){return createTransport().deliver(cargo);}}public static class RoadLogistics extends Logistics{protected Transport createTransport(){return new Truck();}}public static class SeaLogistics extends Logistics{protected Transport createTransport(){return new Ship();}}public static Transport createTransport(String kind){return switch(kind){case "truck"->new Truck();case "ship"->new Ship();default->throw new IllegalArgumentException();};}
}
