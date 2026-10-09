package creational

type Transport interface {
	Kind() string
	Deliver(string) string
}
type Truck struct{}

func (Truck) Kind() string                { return "truck" }
func (Truck) Deliver(cargo string) string { return "Truck delivers " + cargo + " by road" }

type Ship struct{}

func (Ship) Kind() string                { return "ship" }
func (Ship) Deliver(cargo string) string { return "Ship delivers " + cargo + " by sea" }

type Logistics struct{ CreateTransport func() Transport }

func (l Logistics) PlanDelivery(cargo string) string { return l.CreateTransport().Deliver(cargo) }

type RoadLogistics struct{}

func (RoadLogistics) PlanDelivery(cargo string) string {
	return Logistics{func() Transport { return Truck{} }}.PlanDelivery(cargo)
}

type SeaLogistics struct{}

func (SeaLogistics) PlanDelivery(cargo string) string {
	return Logistics{func() Transport { return Ship{} }}.PlanDelivery(cargo)
}
func CreateTransport(kind string) Transport {
	switch kind {
	case "truck":
		return Truck{}
	case "ship":
		return Ship{}
	default:
		panic("unknown transport")
	}
}
