package patterns.structural;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Flyweight {
public record TreeType(String name,String color,String texture){public String draw(double x,double y){return name+"("+color+") at "+format(x)+","+format(y);}private static String format(double v){return v==(long)v?Long.toString((long)v):Double.toString(v);}}public static class TreeTypeFactory{private final Map<String,TreeType> types=new HashMap<>();public int count(){return types.size();}public TreeType get(String name,String color,String texture){String key=name+"|"+color+"|"+texture;return types.computeIfAbsent(key,k->new TreeType(name,color,texture));}}public static class Forest{private record Tree(double x,double y,TreeType type){}private final List<Tree> trees=new ArrayList<>();private final TreeTypeFactory factory;public Forest(){this(new TreeTypeFactory());}public Forest(TreeTypeFactory f){factory=f;}public int treeCount(){return trees.size();}public int typeCount(){return factory.count();}public Forest plant(double x,double y,String name,String color,String texture){trees.add(new Tree(x,y,factory.get(name,color,texture)));return this;}public List<String> draw(){List<String> o=new ArrayList<>();for(Tree t:trees)o.add(t.type.draw(t.x,t.y));return o;}}
}
