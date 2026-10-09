package patterns.architectural;
import java.util.function.Predicate;

public final class Specification {
    public static class Spec<T> {
        private final Predicate<T> predicate;public Spec(Predicate<T> predicate){this.predicate=predicate;}
        public boolean isSatisfiedBy(T candidate){return predicate.test(candidate);}
        public Spec<T> and(Spec<T> other){return new Spec<>(candidate->isSatisfiedBy(candidate)&&other.isSatisfiedBy(candidate));}
        public Spec<T> or(Spec<T> other){return new Spec<>(candidate->isSatisfiedBy(candidate)||other.isSatisfiedBy(candidate));}
        public Spec<T> not(){return new Spec<>(candidate->!isSatisfiedBy(candidate));}
    }
    public static <T> Spec<T> spec(Predicate<T> predicate){return new Spec<>(predicate);}
}
