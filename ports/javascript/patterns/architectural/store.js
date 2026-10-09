export const createStore = (reducer, initialState) => {
    let state = initialState;
    const listeners = new Set();
    let dispatching = false;
    return {
        getState: () => state,
        dispatch(action) {
            if (dispatching)
                throw new Error('Reducers may not dispatch actions');
            dispatching = true;
            try {
                state = reducer(state, action);
            }
            finally {
                dispatching = false;
            }
            for (const listener of [...listeners])
                listener();
            return action;
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
};
export const combineReducers = (reducers) => (state, action) => {
    let changed = false;
    const next = {};
    for (const key of Object.keys(reducers)) {
        next[key] = reducers[key](state[key], action);
        changed ||= next[key] !== state[key];
    }
    return changed ? next : state;
};
export const counterReducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return state + 1;
        case 'decrement':
            return state - 1;
        case 'add':
            return state + action.amount;
    }
};
