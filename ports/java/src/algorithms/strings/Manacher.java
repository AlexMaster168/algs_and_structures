package algorithms.strings;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Manacher {
public static String longestPalindromicSubstring(String s){if(s.length()<2)return s;int n=2*s.length()+1;int[] r=new int[n];int c=0,right=0,best=0;for(int i=0;i<n;i++){if(i<right)r[i]=Math.min(right-i,r[2*c-i]);while(i-r[i]-1>=0&&i+r[i]+1<n&&equal(s,i-r[i]-1,i+r[i]+1))r[i]++;if(i+r[i]>right){c=i;right=i+r[i];}if(r[i]>r[best])best=i;}int start=(best-r[best])/2;return s.substring(start,start+r[best]);}private static boolean equal(String s,int i,int j){return i%2==0&&j%2==0||i%2==1&&j%2==1&&s.charAt(i/2)==s.charAt(j/2);}
}
