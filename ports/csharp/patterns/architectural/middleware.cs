namespace Patterns.Architectural;

public delegate Task Middleware<C>(C context, Func<Task> next);
public static class MiddlewareComposer
{
    public static Func<C, Task> Compose<C>(IReadOnlyList<Middleware<C>> middlewares) => context =>
    {
        var lastIndex = -1;
        async Task Dispatch(int index)
        {
            if (index <= lastIndex) throw new InvalidOperationException("next() called multiple times");
            lastIndex = index;
            if (index < middlewares.Count) await middlewares[index](context, () => Dispatch(index + 1));
        }
        return Dispatch(0);
    };
}
public sealed class Pipeline<C>
{
    private readonly List<Middleware<C>> middlewares = [];
    public Pipeline<C> Use(Middleware<C> middleware) { middlewares.Add(middleware); return this; }
    public Task Run(C context) => MiddlewareComposer.Compose(middlewares)(context);
}
