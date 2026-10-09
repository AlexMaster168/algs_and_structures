package algorithms.backtracking;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Sudoku {
public static int[][] solveSudoku(int[][] input){int[][] b=new int[9][9];int[] rows=new int[9],cols=new int[9],boxes=new int[9];List<int[]> empty=new ArrayList<>();for(int r=0;r<9;r++)for(int c=0;c<9;c++){int v=input[r][c];b[r][c]=v;if(v==0){empty.add(new int[]{r,c});continue;}if(v<1||v>9)return null;int box=r/3*3+c/3,bit=1<<v;if(((rows[r]|cols[c]|boxes[box])&bit)!=0)return null;rows[r]|=bit;cols[c]|=bit;boxes[box]|=bit;}return fill(b,rows,cols,boxes,empty,0)?b:null;}private static boolean fill(int[][] b,int[] rows,int[] cols,int[] boxes,List<int[]> e,int i){if(i==e.size())return true;int r=e.get(i)[0],c=e.get(i)[1],box=r/3*3+c/3;for(int v=1;v<=9;v++){int bit=1<<v;if(((rows[r]|cols[c]|boxes[box])&bit)!=0)continue;b[r][c]=v;rows[r]|=bit;cols[c]|=bit;boxes[box]|=bit;if(fill(b,rows,cols,boxes,e,i+1))return true;b[r][c]=0;rows[r]^=bit;cols[c]^=bit;boxes[box]^=bit;}return false;}
}
