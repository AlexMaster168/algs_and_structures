package behavioral

import "math"

type Parcel struct{ WeightKg, OrderTotal float64 }
type ShippingStrategy interface {
	Name() string
	Cost(Parcel) float64
}
type FlatRateShipping struct{ Rate float64 }

func (FlatRateShipping) Name() string          { return "flat" }
func (s FlatRateShipping) Cost(Parcel) float64 { return s.Rate }

type WeightBasedShipping struct{ PricePerKg float64 }

func (WeightBasedShipping) Name() string { return "weight" }
func (s WeightBasedShipping) Cost(parcel Parcel) float64 {
	return math.Ceil(parcel.WeightKg) * s.PricePerKg
}

type FreeOverThresholdShipping struct {
	Threshold float64
	Fallback  ShippingStrategy
}

func (FreeOverThresholdShipping) Name() string { return "free-over-threshold" }
func (s FreeOverThresholdShipping) Cost(parcel Parcel) float64 {
	if parcel.OrderTotal >= s.Threshold {
		return 0
	}
	return s.Fallback.Cost(parcel)
}

type ShippingCalculator struct{ Strategy ShippingStrategy }

func (s *ShippingCalculator) SetStrategy(strategy ShippingStrategy) { s.Strategy = strategy }
func (s *ShippingCalculator) Calculate(parcel Parcel) float64       { return s.Strategy.Cost(parcel) }
func (s *ShippingCalculator) Cheapest(parcel Parcel, strategies []ShippingStrategy) ShippingStrategy {
	if len(strategies) == 0 {
		panic("no strategies")
	}
	best := strategies[0]
	for _, strategy := range strategies[1:] {
		if strategy.Cost(parcel) < best.Cost(parcel) {
			best = strategy
		}
	}
	return best
}
