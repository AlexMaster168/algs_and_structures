package algorithms.graphs;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class FloodFill {
public static int[][] floodFill(int[][] image,int row,int col,int color){int[][] o=new int[image.length][];for(int i=0;i<o.length;i++)o[i]=image[i].clone();if(row<0||row>=o.length||col<0||col>=o[row].length||o[row][col]==color)return o;int original=o[row][col];Deque<int[]> st=new ArrayDeque<>();st.push(new int[]{row,col});while(!st.isEmpty()){int[] x=st.pop();int r=x[0],c=x[1];if(r<0||r>=o.length||c<0||c>=o[r].length||o[r][c]!=original)continue;o[r][c]=color;st.push(new int[]{r+1,c});st.push(new int[]{r-1,c});st.push(new int[]{r,c+1});st.push(new int[]{r,c-1});}return o;}
}
