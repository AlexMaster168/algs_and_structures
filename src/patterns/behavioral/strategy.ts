export interface Parcel {
  weightKg: number;
  orderTotal: number;
}

export interface ShippingStrategy {
  readonly name: string;
  cost(parcel: Parcel): number;
}

export class FlatRateShipping implements ShippingStrategy {
  readonly name = 'flat';

  constructor(private readonly rate: number) {}

  cost(): number {
    return this.rate;
  }
}

export class WeightBasedShipping implements ShippingStrategy {
  readonly name = 'weight';

  constructor(private readonly pricePerKg: number) {}

  cost(parcel: Parcel): number {
    return Math.ceil(parcel.weightKg) * this.pricePerKg;
  }
}

export class FreeOverThresholdShipping implements ShippingStrategy {
  readonly name = 'free-over-threshold';

  constructor(
    private readonly threshold: number,
    private readonly fallback: ShippingStrategy,
  ) {}

  cost(parcel: Parcel): number {
    return parcel.orderTotal >= this.threshold ? 0 : this.fallback.cost(parcel);
  }
}

export class ShippingCalculator {
  constructor(private strategy: ShippingStrategy) {}

  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy;
  }

  calculate(parcel: Parcel): number {
    return this.strategy.cost(parcel);
  }

  cheapest(parcel: Parcel, strategies: readonly ShippingStrategy[]): ShippingStrategy {
    return strategies.reduce((best, strategy) => (strategy.cost(parcel) < best.cost(parcel) ? strategy : best));
  }
}
