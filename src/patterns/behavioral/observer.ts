export type Observer<T> = (value: T) => void;

export class Subject<T> {
  private readonly observers = new Set<Observer<T>>();

  get observerCount(): number {
    return this.observers.size;
  }

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify(value: T): void {
    for (const observer of [...this.observers]) observer(value);
  }
}

export interface PriceChange {
  symbol: string;
  price: number;
  change: number;
}

export class StockTicker {
  readonly changes = new Subject<PriceChange>();
  private readonly prices = new Map<string, number>();

  update(symbol: string, price: number): void {
    const previous = this.prices.get(symbol) ?? price;
    this.prices.set(symbol, price);
    this.changes.notify({ symbol, price, change: price - previous });
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private current: T) {
    super();
  }

  get value(): T {
    return this.current;
  }

  override subscribe(observer: Observer<T>): () => void {
    observer(this.current);
    return super.subscribe(observer);
  }

  override notify(value: T): void {
    this.current = value;
    super.notify(value);
  }
}
