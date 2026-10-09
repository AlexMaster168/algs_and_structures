package structural

import (
	"math"
	"sync"
)

type TemperatureSensor interface{ Celsius() float64 }
type LegacyFahrenheitSensor struct{ Reading float64 }

func (s LegacyFahrenheitSensor) ReadFahrenheit() float64 { return s.Reading }

type FahrenheitSensorAdapter struct{ Legacy LegacyFahrenheitSensor }

func (s FahrenheitSensorAdapter) Celsius() float64 {
	return math.Floor((s.Legacy.ReadFahrenheit()-32)*5/9*10+0.5) / 10
}
func AverageTemperature(sensors []TemperatureSensor) float64 {
	total := 0.0
	for _, sensor := range sensors {
		total += sensor.Celsius()
	}
	return total / float64(len(sensors))
}

type Result[T any] struct {
	Value T
	Error error
}

func Promisify[A, T any](action func(A, func(error, T))) func(A) <-chan Result[T] {
	return func(argument A) <-chan Result[T] {
		channel := make(chan Result[T], 1)
		var once sync.Once
		action(argument, func(error error, value T) { once.Do(func() { channel <- Result[T]{value, error}; close(channel) }) })
		return channel
	}
}
