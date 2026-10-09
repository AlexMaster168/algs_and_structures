package patterns.behavioral;
import java.util.*;

public final class Iterator {
    public static class NumberRange implements Iterable<Double> {
        private final double start,end,step;
        public NumberRange(double start,double end){this(start,end,1);}
        public NumberRange(double start,double end,double step){if(step==0)throw new IllegalArgumentException();this.start=start;this.end=end;this.step=step;}
        public java.util.Iterator<Double> createIterator(){return new java.util.Iterator<>(){double current=start;public boolean hasNext(){return step>0?current<end:current>end;}public Double next(){if(!hasNext())throw new NoSuchElementException();double result=current;current+=step;return result;}};}
        public java.util.Iterator<Double> iterator(){return createIterator();}
    }
    public record TreeItem<T>(T value,List<TreeItem<T>> children) {}
    public static <T> Iterable<T> depthFirst(List<TreeItem<T>> roots){return ()->new java.util.Iterator<>(){final Deque<TreeItem<T>> stack=init();private Deque<TreeItem<T>> init(){var s=new ArrayDeque<TreeItem<T>>();for(int i=roots.size()-1;i>=0;i--)s.push(roots.get(i));return s;}public boolean hasNext(){return !stack.isEmpty();}public T next(){var n=stack.pop();if(n.children()!=null)for(int i=n.children().size()-1;i>=0;i--)stack.push(n.children().get(i));return n.value();}};}
    public static <T> Iterable<T> breadthFirst(List<TreeItem<T>> roots){return ()->new java.util.Iterator<>(){final Deque<TreeItem<T>> queue=new ArrayDeque<>(roots);public boolean hasNext(){return !queue.isEmpty();}public T next(){var n=queue.remove();if(n.children()!=null)queue.addAll(n.children());return n.value();}};}
    public static <T> Iterable<T> take(Iterable<T> source,int count){return ()->new java.util.Iterator<>(){final java.util.Iterator<T> iterator=source.iterator();int left=count;public boolean hasNext(){return left>0&&iterator.hasNext();}public T next(){if(!hasNext())throw new NoSuchElementException();left--;return iterator.next();}};}
}
