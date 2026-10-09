import math


class FlatRateShipping:
    name = 'flat'

    def __init__(self, rate):
        self.rate = rate

    def cost(self, parcel):
        return self.rate


class WeightBasedShipping:
    name = 'weight'

    def __init__(self, price_per_kg):
        self.price_per_kg = price_per_kg

    def cost(self, parcel):
        return math.ceil(parcel['weightKg']) * self.price_per_kg


class FreeOverThresholdShipping:
    name = 'free-over-threshold'

    def __init__(self, threshold, fallback):
        self.threshold, self.fallback = threshold, fallback

    def cost(self, parcel):
        return 0 if parcel['orderTotal'] >= self.threshold else self.fallback.cost(parcel)


class ShippingCalculator:
    def __init__(self, strategy):
        self.strategy = strategy

    def set_strategy(self, strategy):
        self.strategy = strategy

    def calculate(self, parcel):
        return self.strategy.cost(parcel)

    def cheapest(self, parcel, strategies):
        return min(strategies, key=lambda strategy: strategy.cost(parcel))
