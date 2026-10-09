package patterns.architectural;
import java.io.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.function.UnaryOperator;
import patterns.architectural.Specification.Spec;

public final class Repository {
    public interface Entity extends Serializable {String id();}
    public static class InMemoryRepository<T extends Entity> {
        private final Map<String,T> items=new LinkedHashMap<>();private final UnaryOperator<T> copy;
        public InMemoryRepository(){this(InMemoryRepository::cloneEntity);}public InMemoryRepository(UnaryOperator<T> copy){this.copy=copy;}
        @SuppressWarnings("unchecked")
        private static <T> T cloneEntity(T value){try{var bytes=new ByteArrayOutputStream();try(var output=new ObjectOutputStream(bytes)){output.writeObject(value);}try(var input=new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))){return (T)input.readObject();}}catch(IOException|ClassNotFoundException e){throw new IllegalArgumentException("Entity cannot be copied",e);}}
        public CompletableFuture<T> findById(String id){T item=items.get(id);return CompletableFuture.completedFuture(item==null?null:copy.apply(item));}
        public CompletableFuture<List<T>> findAll(){return findAll(null);}
        public CompletableFuture<List<T>> findAll(Spec<T> spec){return CompletableFuture.completedFuture(items.values().stream().filter(item->spec==null||spec.isSatisfiedBy(item)).map(copy).toList());}
        public CompletableFuture<Void> save(T entity){items.put(entity.id(),copy.apply(entity));return CompletableFuture.completedFuture(null);}
        public CompletableFuture<Boolean> delete(String id){boolean existed=items.containsKey(id);items.remove(id);return CompletableFuture.completedFuture(existed);}
    }
}
