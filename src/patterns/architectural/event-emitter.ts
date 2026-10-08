type Listener<P> = (payload: P) => void;

export class TypedEventEmitter<Events extends Record<string, unknown>> {
  private readonly listeners = new Map<keyof Events, Set<Listener<never>>>();

  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);
    return () => this.off(event, listener);
  }

  once<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void {
    const off = this.on(event, (payload) => {
      off();
      listener(payload);
    });
    return off;
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<E extends keyof Events>(event: E, payload: Events[E]): number {
    const set = this.listeners.get(event);
    if (!set) return 0;
    for (const listener of [...set]) (listener as Listener<Events[E]>)(payload);
    return set.size;
  }

  listenerCount(event: keyof Events): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
