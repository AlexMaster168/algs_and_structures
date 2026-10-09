export const compose = (middlewares) => (context) => {
    let lastIndex = -1;
    const dispatch = async (index) => {
        if (index <= lastIndex)
            throw new Error('next() called multiple times');
        lastIndex = index;
        const middleware = middlewares[index];
        if (middleware)
            await middleware(context, () => dispatch(index + 1));
    };
    return dispatch(0);
};
export class Pipeline {
    middlewares = [];
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    run(context) {
        return compose(this.middlewares)(context);
    }
}
