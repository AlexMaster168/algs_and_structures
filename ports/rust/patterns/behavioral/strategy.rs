use std::rc::Rc;
pub struct Parcel {
    pub weight_kg: f64,
    pub order_total: f64,
}
pub trait ShippingStrategy {
    fn name(&self) -> &str;
    fn cost(&self, parcel: &Parcel) -> f64;
}
pub struct FlatRateShipping {
    rate: f64,
}
impl FlatRateShipping {
    pub fn new(rate: f64) -> Self {
        Self { rate }
    }
}
impl ShippingStrategy for FlatRateShipping {
    fn name(&self) -> &str {
        "flat"
    }
    fn cost(&self, _: &Parcel) -> f64 {
        self.rate
    }
}
pub struct WeightBasedShipping {
    price_per_kg: f64,
}
impl WeightBasedShipping {
    pub fn new(price_per_kg: f64) -> Self {
        Self { price_per_kg }
    }
}
impl ShippingStrategy for WeightBasedShipping {
    fn name(&self) -> &str {
        "weight"
    }
    fn cost(&self, parcel: &Parcel) -> f64 {
        parcel.weight_kg.ceil() * self.price_per_kg
    }
}
pub struct FreeOverThresholdShipping {
    threshold: f64,
    fallback: Rc<dyn ShippingStrategy>,
}
impl FreeOverThresholdShipping {
    pub fn new(threshold: f64, fallback: Rc<dyn ShippingStrategy>) -> Self {
        Self {
            threshold,
            fallback,
        }
    }
}
impl ShippingStrategy for FreeOverThresholdShipping {
    fn name(&self) -> &str {
        "free-over-threshold"
    }
    fn cost(&self, parcel: &Parcel) -> f64 {
        if parcel.order_total >= self.threshold {
            0.0
        } else {
            self.fallback.cost(parcel)
        }
    }
}
pub struct ShippingCalculator {
    strategy: Rc<dyn ShippingStrategy>,
}
impl ShippingCalculator {
    pub fn new(strategy: Rc<dyn ShippingStrategy>) -> Self {
        Self { strategy }
    }
    pub fn set_strategy(&mut self, strategy: Rc<dyn ShippingStrategy>) {
        self.strategy = strategy;
    }
    pub fn calculate(&self, parcel: &Parcel) -> f64 {
        self.strategy.cost(parcel)
    }
    pub fn cheapest(
        &self,
        parcel: &Parcel,
        strategies: &[Rc<dyn ShippingStrategy>],
    ) -> Option<Rc<dyn ShippingStrategy>> {
        let mut best = strategies.first()?.clone();
        for strategy in &strategies[1..] {
            if strategy.cost(parcel) < best.cost(parcel) {
                best = strategy.clone();
            }
        }
        Some(best)
    }
}
