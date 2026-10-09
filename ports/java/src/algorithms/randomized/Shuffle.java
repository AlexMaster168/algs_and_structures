package algorithms.randomized;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Shuffle {
public static <T> List<T> fisherYatesShuffle(List<T> a){return fisherYatesShuffle(a,Math::random);}public static <T> List<T> fisherYatesShuffle(List<T> a,DoubleSupplier rand){a=new ArrayList<>(a);for(int i=a.size()-1;i>0;i--)Collections.swap(a,i,(int)(rand.getAsDouble()*(i+1)));return a;}public static <T> List<T> reservoirSample(Iterable<T> stream,int size){return reservoirSample(stream,size,Math::random);}public static <T> List<T> reservoirSample(Iterable<T> stream,int size,DoubleSupplier rand){List<T> o=new ArrayList<>();int seen=0;for(T x:stream){seen++;if(o.size()<size)o.add(x);else{int j=(int)(rand.getAsDouble()*seen);if(j<size)o.set(j,x);}}return o;}public static DoubleSupplier mulberry32(int seed){int[] state={seed};return ()->{int t=state[0]+=0x6d2b79f5;t=(t^(t>>>15))*(t|1);t^=t+(t^(t>>>7))*(t|61);return Integer.toUnsignedLong(t^(t>>>14))/4294967296.0;};}public static double monteCarloPi(int n){return monteCarloPi(n,Math::random);}public static double monteCarloPi(int n,DoubleSupplier rand){int c=0;for(int i=0;i<n;i++){double x=rand.getAsDouble(),y=rand.getAsDouble();if(x*x+y*y<=1)c++;}return 4.0*c/n;}
}
