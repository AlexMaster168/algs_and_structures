export class FlatRateShipping {
    rate;
    name = 'flat';
    constructor(rate) {
        this.rate = rate;
    }
    cost() {
        return this.rate;
    }
}
export class WeightBasedShipping {
    pricePerKg;
    name = 'weight';
    constructor(pricePerKg) {
        this.pricePerKg = pricePerKg;
    }
    cost(parcel) {
        return Math.ceil(parcel.weightKg) * this.pricePerKg;
    }
}
export class FreeOverThresholdShipping {
    threshold;
    fallback;
    name = 'free-over-threshold';
    constructor(threshold, fallback) {
        this.threshold = threshold;
        this.fallback = fallback;
    }
    cost(parcel) {
        return parcel.orderTotal >= this.threshold ? 0 : this.fallback.cost(parcel);
    }
}
export class ShippingCalculator {
    strategy;
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    calculate(parcel) {
        return this.strategy.cost(parcel);
    }
    cheapest(parcel, strategies) {
        return strategies.reduce((best, strategy) => (strategy.cost(parcel) < best.cost(parcel) ? strategy : best));
    }
}
