import java.lang.reflect.*;
import java.math.BigInteger;
import java.nio.file.*;
import java.util.*;
import shared.Json;

public class Conformance {
    static Object convert(Object value,Type target) {
        if(target instanceof ParameterizedType p){Class<?> raw=(Class<?>)p.getRawType();if(Collection.class.isAssignableFrom(raw)||raw==Iterable.class){List<Object> out=new ArrayList<>();for(Object v:(List<?>)value)out.add(convert(v,p.getActualTypeArguments()[0]));return raw==Set.class?new LinkedHashSet<>(out):out;}return convert(value,raw);}
        if(!(target instanceof Class<?> type))return value;
        if(type.isArray()){List<?> values=(List<?>)value;Object array=Array.newInstance(type.getComponentType(),values.size());for(int i=0;i<values.size();i++)Array.set(array,i,convert(values.get(i),type.getComponentType()));return array;}
        if(value instanceof Number n){if(type==int.class||type==Integer.class)return (int)n.longValue();if(type==long.class||type==Long.class)return n.longValue();if(type==double.class||type==Double.class)return n.doubleValue();}
        if(type==BigInteger.class)return new BigInteger(value.toString());
        return value;
    }
    static Object normalize(Object value) throws Exception {
        if(value instanceof BigInteger)return value.toString();
        if(value==null||value instanceof Number||value instanceof String||value instanceof Boolean)return value;
        if(value.getClass().isArray()){List<Object> out=new ArrayList<>();for(int i=0;i<Array.getLength(value);i++)out.add(normalize(Array.get(value,i)));return out;}
        if(value instanceof Map<?,?> map){List<Object> out=new ArrayList<>();for(var e:map.entrySet())out.add(List.of(normalize(e.getKey()),normalize(e.getValue())));return out;}
        if(value instanceof Iterable<?> values){List<Object> out=new ArrayList<>();for(Object v:values)out.add(normalize(v));return out;}
        if(value.getClass().isRecord()){Map<String,Object> out=new LinkedHashMap<>();for(var c:value.getClass().getRecordComponents())out.put(c.getName(),normalize(c.getAccessor().invoke(value)));return out;}
        throw new IllegalArgumentException("Unsupported result: "+value.getClass());
    }
    static boolean equal(Object a,Object b) {
        if(a instanceof Number x&&b instanceof Number y)return Math.abs(x.doubleValue()-y.doubleValue())<=1e-9*Math.max(1,Math.abs(y.doubleValue()));
        if(a instanceof List<?> x&&b instanceof List<?> y){if(x.size()!=y.size())return false;for(int i=0;i<x.size();i++)if(!equal(x.get(i),y.get(i)))return false;return true;}
        if(a instanceof Map<?,?> x&&b instanceof Map<?,?> y){if(!x.keySet().equals(y.keySet()))return false;for(Object k:x.keySet())if(!equal(x.get(k),y.get(k)))return false;return true;}
        return Objects.equals(a,b);
    }
    static void verify(boolean condition){if(!condition)throw new AssertionError();}
    public static void main(String[] args) throws Exception {
        Map<?,?> modules=(Map<?,?>)Json.parse(Files.readString(Path.of(args[1])));
        int cases=0;
        for(Object item:(List<?>)Json.parse(Files.readString(Path.of(args[0])))){
            Map<?,?> example=(Map<?,?>)item;Class<?> type=Class.forName((String)modules.get(example.get("source")));List<?> parameters=(List<?>)example.get("args");Method chosen=null;Object[] converted=null;
            for(Method method:type.getMethods())if(Modifier.isStatic(method.getModifiers())&&method.getName().equals(example.get("name"))&&method.getParameterCount()==parameters.size()){
                try{Object[] values=new Object[parameters.size()];for(int i=0;i<values.length;i++)values[i]=convert(parameters.get(i),method.getGenericParameterTypes()[i]);chosen=method;converted=values;break;}catch(RuntimeException ignored){}
            }
            if(chosen==null)throw new AssertionError("Missing method: "+example.get("source")+":"+example.get("name"));
            Object result=normalize(chosen.invoke(null,converted));if(!equal(result,example.get("expected")))throw new AssertionError(example.get("name")+": "+result+" != "+example.get("expected"));cases++;
        }
        var tree=new data_structures.trees.RedBlackTree.Tree<Integer>();var btree=new data_structures.trees.BTree.Tree<Integer>();var avl=new data_structures.trees.AVLTree.Tree<Integer>();var expected=new TreeSet<Integer>();var random=new Random(71);
        for(int i=0;i<2000;i++){int value=random.nextInt(100);if(random.nextBoolean()){boolean changed=expected.add(value);verify(tree.insert(value)==changed);verify(btree.insert(value)==changed);verify(avl.insert(value)==changed);}else{boolean changed=expected.remove(value);verify(tree.delete(value)==changed);verify(btree.delete(value)==changed);verify(avl.delete(value)==changed);}verify(tree.toArray().equals(new ArrayList<>(expected)));verify(btree.toArray().equals(new ArrayList<>(expected)));verify(avl.toArray().equals(new ArrayList<>(expected)));verify(tree.isValid());}
        var document=new patterns.behavioral.Command.TextDocument();var history=new patterns.behavioral.Command.CommandHistory();history.run(new patterns.behavioral.Command.InsertCommand(document,0,"hello"));verify(history.undo()&&document.content.isEmpty());verify(history.redo()&&document.content.equals("hello"));
        verify(patterns.behavioral.Interpreter.parseExpression("2+x*3").interpret(Map.of("x",4.0))==14);
        var order=new patterns.behavioral.State.Order();order.pay();order.ship();order.deliver();verify(order.status().equals("delivered"));
        var miner=new patterns.behavioral.TemplateMethod.JsonSalesMiner();verify(miner.mine("[{\"product\":\"apple\",\"amount\":3}]").total()==3);
        var container=new patterns.architectural.DependencyInjection.Container();var token=patterns.architectural.DependencyInjection.<Object>token("service");container.register(token,c->new Object());verify(container.resolve(token)==container.resolve(token));
        var calls=new java.util.concurrent.atomic.AtomicInteger();patterns.architectural.CircuitBreaker.retry(()->calls.incrementAndGet()<3?java.util.concurrent.CompletableFuture.failedFuture(new Exception()):java.util.concurrent.CompletableFuture.completedFuture(7),3,0,2).join();verify(calls.get()==3);
        System.out.println("PASS Java: "+cases+" reference cases, 2000 tree mutations, pattern checks");
    }
}
