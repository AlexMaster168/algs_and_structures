package algorithms.searching;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class InterpolationSearch {
public static int interpolationSearch(double[] a,double t){int l=0,h=a.length-1;while(l<=h&&t>=a[l]&&t<=a[h]){if(a[l]==a[h])return a[l]==t?l:-1;int p=l+(int)((t-a[l])*(h-l)/(a[h]-a[l]));if(a[p]==t)return p;if(a[p]<t)l=p+1;else h=p-1;}return -1;}
}
