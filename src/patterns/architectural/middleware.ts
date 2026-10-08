export type Next = () => Promise<void>;
export type Middleware<C> = (context: C, next: Next) => Promise<void> | void;

export const compose =
  <C>(middlewares: readonly Middleware<C>[]) =>
  (context: C): Promise<void> => {
    let lastIndex = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= lastIndex) throw new Error('next() called multiple times');
      lastIndex = index;
      const middleware = middlewares[index];
      if (middleware) await middleware(context, () => dispatch(index + 1));
    };

    return dispatch(0);
  };

export class Pipeline<C> {
  private readonly middlewares: Middleware<C>[] = [];

  use(middleware: Middleware<C>): this {
    this.middlewares.push(middleware);
    return this;
  }

  run(context: C): Promise<void> {
    return compose(this.middlewares)(context);
  }
}
