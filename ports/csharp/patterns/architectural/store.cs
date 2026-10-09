namespace Patterns.Architectural;

public sealed class StateStore<S, A>(Func<S, A, S> reducer, S initialState)
{
    private S state = initialState;
    private bool dispatching;
    private readonly HashSet<Action> listeners = [];
    public S GetState() => state;
    public A Dispatch(A action)
    {
        if (dispatching) throw new InvalidOperationException("Reducers may not dispatch actions");
        dispatching = true;
        try { state = reducer(state, action); } finally { dispatching = false; }
        foreach (var listener in listeners.ToArray()) listener();
        return action;
    }
    public Action Subscribe(Action listener) { listeners.Add(listener); return () => listeners.Remove(listener); }
}
public sealed record CounterAction(string Type, double Amount = 0);
public static class Store
{
    public static StateStore<S, A> CreateStore<S, A>(Func<S, A, S> reducer, S initialState) => new(reducer, initialState);
    public static Func<IReadOnlyDictionary<string, object?>, A, IReadOnlyDictionary<string, object?>> CombineReducers<A>(IReadOnlyDictionary<string, Func<object?, A, object?>> reducers) => (state, action) =>
    {
        var changed = false; var result = new Dictionary<string, object?>();
        foreach (var (key, reducer) in reducers) { var value = reducer(state[key], action); result[key] = value; changed |= !Equals(value, state[key]); }
        return changed ? result : state;
    };
    public static double CounterReducer(double state, CounterAction action) => action.Type switch
    {
        "increment" => state + 1, "decrement" => state - 1, "add" => state + action.Amount, _ => throw new ArgumentException("Unknown action")
    };
}
