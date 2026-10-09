namespace Patterns.Architectural;

public interface ISpecification<T>
{
    bool IsSatisfiedBy(T candidate);
    ISpecification<T> And(ISpecification<T> other);
    ISpecification<T> Or(ISpecification<T> other);
    ISpecification<T> Not();
}
public sealed class Spec<T>(Func<T, bool> predicate) : ISpecification<T>
{
    public bool IsSatisfiedBy(T candidate) => predicate(candidate);
    public ISpecification<T> And(ISpecification<T> other) => new Spec<T>(candidate => IsSatisfiedBy(candidate) && other.IsSatisfiedBy(candidate));
    public ISpecification<T> Or(ISpecification<T> other) => new Spec<T>(candidate => IsSatisfiedBy(candidate) || other.IsSatisfiedBy(candidate));
    public ISpecification<T> Not() => new Spec<T>(candidate => !IsSatisfiedBy(candidate));
}
public static class Specification { public static ISpecification<T> Spec<T>(Func<T, bool> predicate) => new Spec<T>(predicate); }
