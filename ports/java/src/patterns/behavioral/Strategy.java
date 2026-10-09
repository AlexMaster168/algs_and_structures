package patterns.behavioral;
import java.util.*;

public final class Strategy {
    public record Parcel(double weightKg,double orderTotal) {}
    public interface ShippingStrategy {String name();double cost(Parcel parcel);}
    public record FlatRateShipping(double rate) implements ShippingStrategy {public String name(){return "flat";}public double cost(Parcel p){return rate;}}
    public record WeightBasedShipping(double pricePerKg) implements ShippingStrategy {public String name(){return "weight";}public double cost(Parcel p){return Math.ceil(p.weightKg())*pricePerKg;}}
    public record FreeOverThresholdShipping(double threshold,ShippingStrategy fallback) implements ShippingStrategy {public String name(){return "free-over-threshold";}public double cost(Parcel p){return p.orderTotal()>=threshold?0:fallback.cost(p);}}
    public static class ShippingCalculator {
        private ShippingStrategy strategy;public ShippingCalculator(ShippingStrategy s){strategy=s;}public void setStrategy(ShippingStrategy s){strategy=s;}public double calculate(Parcel p){return strategy.cost(p);}
        public ShippingStrategy cheapest(Parcel p,List<ShippingStrategy> strategies){return strategies.stream().min(Comparator.comparingDouble(s->s.cost(p))).orElseThrow();}
    }
}
