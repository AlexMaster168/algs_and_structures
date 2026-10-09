package patterns.structural;
import java.util.*;
import java.util.function.*;
import java.math.*;

public class Composite {
public interface FileSystemNode{String name();long size();List<String> render(String indent);default List<String> render(){return render("");}}public static class FileEntry implements FileSystemNode{public final String name;private final long bytes;public FileEntry(String n,long b){name=n;bytes=b;}public String name(){return name;}public long size(){return bytes;}public List<String> render(String indent){return List.of(indent+name+" ("+bytes+")");}}public static class Directory implements FileSystemNode{public final String name;private final List<FileSystemNode> children=new ArrayList<>();public Directory(String n){name=n;}public String name(){return name;}public Directory add(FileSystemNode... nodes){children.addAll(Arrays.asList(nodes));return this;}public boolean remove(String name){for(int i=0;i<children.size();i++)if(children.get(i).name().equals(name)){children.remove(i);return true;}return false;}public long size(){long s=0;for(var c:children)s+=c.size();return s;}public List<String> render(String indent){List<String> o=new ArrayList<>();o.add(indent+name+"/ ("+size()+")");for(var c:children)o.addAll(c.render(indent+"  "));return o;}}
}
