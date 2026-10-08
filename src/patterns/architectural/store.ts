export interface Action<T extends string = string> {
  type: T;
}

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export interface Store<S, A extends Action> {
  getState(): S;
  dispatch(action: A): A;
  subscribe(listener: () => void): () => void;
}

export const createStore = <S, A extends Action>(reducer: Reducer<S, A>, initialState: S): Store<S, A> => {
  let state = initialState;
  const listeners = new Set<() => void>();
  let dispatching = false;

  return {
    getState: () => state,
    dispatch(action) {
      if (dispatching) throw new Error('Reducers may not dispatch actions');
      dispatching = true;
      try {
        state = reducer(state, action);
      } finally {
        dispatching = false;
      }
      for (const listener of [...listeners]) listener();
      return action;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const combineReducers =
  <S extends Record<string, unknown>, A extends Action>(reducers: { [K in keyof S]: Reducer<S[K], A> }): Reducer<S, A> =>
  (state, action) => {
    let changed = false;
    const next = {} as S;
    for (const key of Object.keys(reducers) as (keyof S)[]) {
      next[key] = reducers[key](state[key], action);
      changed ||= next[key] !== state[key];
    }
    return changed ? next : state;
  };

export type CounterAction = { type: 'increment' } | { type: 'decrement' } | { type: 'add'; amount: number };

export const counterReducer: Reducer<number, CounterAction> = (state, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'add':
      return state + action.amount;
  }
};
