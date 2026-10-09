package shared;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Compare {

@SuppressWarnings("unchecked")
public static <T> int defaultCompare(T a,T b) { return ((Comparable<T>)a).compareTo(b); }
public static <T> Comparator<T> reverseCompare(Comparator<T> c) { return (a,b)->c.compare(b,a); }
public static <T> Comparator<T> reverseCompare() { return reverseCompare(Compare::defaultCompare); }

}
