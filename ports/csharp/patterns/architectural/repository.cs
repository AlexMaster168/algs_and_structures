using System.Text.Json;
namespace Patterns.Architectural;

public interface IEntity { string Id { get; } }
public interface IRepository<T> where T : class, IEntity
{
    Task<T?> FindById(string id);
    Task<T[]> FindAll(ISpecification<T>? specification = null);
    Task Save(T entity);
    Task<bool> Delete(string id);
}
public sealed class InMemoryRepository<T>(Func<T, T>? clone = null) : IRepository<T> where T : class, IEntity
{
    private readonly Dictionary<string, T> items = [];
    private readonly Func<T, T> clone = clone ?? (item => JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(item)) ?? throw new InvalidOperationException("Cannot clone entity"));
    public Task<T?> FindById(string id) => Task.FromResult(items.TryGetValue(id, out var item) ? clone(item) : null);
    public Task<T[]> FindAll(ISpecification<T>? specification = null) => Task.FromResult(items.Values.Where(item => specification is null || specification.IsSatisfiedBy(item)).Select(clone).ToArray());
    public Task Save(T entity) { items[entity.Id] = clone(entity); return Task.CompletedTask; }
    public Task<bool> Delete(string id) => Task.FromResult(items.Remove(id));
}
