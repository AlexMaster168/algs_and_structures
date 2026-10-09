package algorithms.dynamic_programming;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class CoinChange {
public record Result(int count,List<Integer> coins){}public static Result minCoins(int[] coins,int amount){int[] b=new int[amount+1],last=new int[amount+1];Arrays.fill(b,Integer.MAX_VALUE/2);Arrays.fill(last,-1);b[0]=0;for(int s=1;s<=amount;s++)for(int c:coins){if(c<=0)throw new IllegalArgumentException();if(c<=s&&b[s-c]+1<b[s]){b[s]=b[s-c]+1;last[s]=c;}}if(last[amount]<0&&amount>0)return null;List<Integer> o=new ArrayList<>();for(int s=amount;s>0;s-=last[s])o.add(last[s]);return new Result(b[amount],o);}public static long coinChangeWays(int[] coins,int amount){long[] w=new long[amount+1];w[0]=1;for(int c:coins){if(c<=0)throw new IllegalArgumentException();for(int s=c;s<=amount;s++)w[s]+=w[s-c];}return w[amount];}
}
