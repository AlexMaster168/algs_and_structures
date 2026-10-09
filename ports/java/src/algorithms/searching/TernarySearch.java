package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class TernarySearch {
public static double ternarySearchMax(DoubleUnaryOperator f,double l,double h){return ternarySearchMax(f,l,h,1e-9);}public static double ternarySearchMax(DoubleUnaryOperator f,double l,double h,double e){if(e<=0)throw new IllegalArgumentException();while(h-l>e){double a=l+(h-l)/3,b=h-(h-l)/3;if(f.applyAsDouble(a)<f.applyAsDouble(b))l=a;else h=b;}return (l+h)/2;}public static double ternarySearchMin(DoubleUnaryOperator f,double l,double h){return ternarySearchMin(f,l,h,1e-9);}public static double ternarySearchMin(DoubleUnaryOperator f,double l,double h,double e){return ternarySearchMax(x->-f.applyAsDouble(x),l,h,e);}public static int findPeakIndex(double[] a){int l=0,h=a.length-1;while(l<h){int m=(l+h)/2;if(a[m]<a[m+1])l=m+1;else h=m;}return l;}
}
