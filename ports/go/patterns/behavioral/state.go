package behavioral

type OrderState interface {
	Name() string
	Pay(*Order)
	Ship(*Order)
	Deliver(*Order)
	Cancel(*Order)
}
type baseState struct{ name string }

func (s baseState) Name() string   { return s.name }
func (s baseState) Pay(*Order)     { panic("cannot pay in " + s.name) }
func (s baseState) Ship(*Order)    { panic("cannot ship in " + s.name) }
func (s baseState) Deliver(*Order) { panic("cannot deliver in " + s.name) }
func (s baseState) Cancel(*Order)  { panic("cannot cancel in " + s.name) }

type newState struct{ baseState }

func (newState) Pay(order *Order)    { order.TransitionTo(paidState{baseState{"paid"}}) }
func (newState) Cancel(order *Order) { order.TransitionTo(baseState{"cancelled"}) }

type paidState struct{ baseState }

func (paidState) Ship(order *Order)   { order.TransitionTo(shippedState{baseState{"shipped"}}) }
func (paidState) Cancel(order *Order) { order.TransitionTo(baseState{"cancelled"}) }

type shippedState struct{ baseState }

func (shippedState) Deliver(order *Order) { order.TransitionTo(baseState{"delivered"}) }

type Order struct {
	state   OrderState
	History []string
}

func NewOrder() *Order          { return &Order{state: newState{baseState{"new"}}, History: []string{"new"}} }
func (o *Order) Status() string { return o.state.Name() }
func (o *Order) TransitionTo(state OrderState) {
	o.state = state
	o.History = append(o.History, state.Name())
}
func (o *Order) Pay()     { o.state.Pay(o) }
func (o *Order) Ship()    { o.state.Ship(o) }
func (o *Order) Deliver() { o.state.Deliver(o) }
func (o *Order) Cancel()  { o.state.Cancel(o) }
