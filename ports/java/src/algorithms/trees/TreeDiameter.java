package algorithms.trees;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class TreeDiameter {
public record Result(int length,List<Integer> path){}private static int farthest(int[] d){int v=0;for(int i=1;i<d.length;i++)if(d[i]>d[v])v=i;return v;}public static Result treeDiameter(List<List<Integer>> g){if(g.isEmpty())return new Result(0,new ArrayList<>());int first=farthest(algorithms.graphs.Bfs.bfs(g,0).distance());var r=algorithms.graphs.Bfs.bfs(g,first);int second=farthest(r.distance());return new Result(r.distance()[second],algorithms.graphs.Types.reconstructPath(r.parent(),second));}
}
