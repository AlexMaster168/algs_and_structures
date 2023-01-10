type Action = { type: string; payload: any };

class Store<T> {
  private state: T;
  private listeners: Array<() => void> = [];

  constructor(private reducer: (state: T, action: Action) => T, initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  dispatch(action: Action): void {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// Example reducer
function reducer(state: any, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
  default:
      return state;
  }

const store = new Store(reducer, { count: 0 });
store.dispatch({ type: 'INCREMENT' }); // logs 1
store.dispatch({ type: 'INCREMENT' }); // logs 2
store.dispatch({ type: 'DECREMENT' }); // logs 1
