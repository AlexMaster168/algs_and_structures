import inspect


def compose(middlewares):
    chain = tuple(middlewares)

    async def run(context):
        last_index = -1

        async def dispatch(index):
            nonlocal last_index
            if index <= last_index:
                raise RuntimeError('next() called multiple times')
            last_index = index
            if index < len(chain):
                result = chain[index](context, lambda: dispatch(index + 1))
                if inspect.isawaitable(result):
                    await result
        await dispatch(0)
    return run


class Pipeline:
    def __init__(self):
        self.middlewares = []

    def use(self, middleware):
        self.middlewares.append(middleware)
        return self

    async def run(self, context):
        await compose(self.middlewares)(context)
