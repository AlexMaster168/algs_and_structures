package behavioral

type Ticket struct {
	Topic    string
	Severity int
}
type SupportHandler struct {
	next      *SupportHandler
	canHandle func(Ticket) bool
	resolve   func(Ticket) string
}

func (h *SupportHandler) SetNext(next *SupportHandler) *SupportHandler { h.next = next; return next }
func (h *SupportHandler) Handle(ticket Ticket) string {
	if h.canHandle(ticket) {
		return h.resolve(ticket)
	}
	if h.next != nil {
		return h.next.Handle(ticket)
	}
	return "Unresolved: " + ticket.Topic
}

type FaqBot struct{ *SupportHandler }

func NewFaqBot() *FaqBot {
	answers := map[string]string{"password": "Use the \"Forgot password\" link", "delivery": "Delivery takes 3-5 days"}
	return &FaqBot{&SupportHandler{canHandle: func(t Ticket) bool { _, ok := answers[t.Topic]; return t.Severity == 1 && ok }, resolve: func(t Ticket) string { return "Bot: " + answers[t.Topic] }}}
}

type SupportAgent struct{ *SupportHandler }

func NewSupportAgent() *SupportAgent {
	return &SupportAgent{&SupportHandler{canHandle: func(t Ticket) bool { return t.Severity <= 2 }, resolve: func(t Ticket) string { return "Agent resolved " + t.Topic }}}
}

type Engineer struct{ *SupportHandler }

func NewEngineer() *Engineer {
	return &Engineer{&SupportHandler{canHandle: func(Ticket) bool { return true }, resolve: func(t Ticket) string { return "Engineer fixed " + t.Topic }}}
}
func CreateSupportChain() *SupportHandler {
	bot := NewFaqBot()
	bot.SetNext(NewSupportAgent().SupportHandler).SetNext(NewEngineer().SupportHandler)
	return bot.SupportHandler
}
