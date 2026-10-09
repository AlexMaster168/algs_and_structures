package algorithms.backtracking;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class WordSearch {
public static boolean wordSearch(List<String> g,String w){int cols=g.isEmpty()?0:g.get(0).length();boolean[][] v=new boolean[g.size()][cols];for(int r=0;r<g.size();r++)for(int c=0;c<cols;c++)if(search(g,w,v,r,c,0))return true;return false;}private static boolean search(List<String> g,String w,boolean[][] v,int r,int c,int i){if(i==w.length())return true;if(r<0||r>=g.size()||c<0||c>=g.get(r).length()||v[r][c]||g.get(r).charAt(c)!=w.charAt(i))return false;v[r][c]=true;boolean b=search(g,w,v,r+1,c,i+1)||search(g,w,v,r-1,c,i+1)||search(g,w,v,r,c+1,i+1)||search(g,w,v,r,c-1,i+1);v[r][c]=false;return b;}
}
