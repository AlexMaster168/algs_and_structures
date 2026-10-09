package architectural

import "fmt"

type Logger interface {
	Info(string)
	Error(string)
}
type MemoryLogger struct{ Lines []string }

func (l *MemoryLogger) Info(message string)  { l.Lines = append(l.Lines, "INFO "+message) }
func (l *MemoryLogger) Error(message string) { l.Lines = append(l.Lines, "ERROR "+message) }

type NullLogger struct{}

func (NullLogger) Info(string)  {}
func (NullLogger) Error(string) {}

type PaymentService struct{ Logger Logger }

func (s PaymentService) Charge(amount float64) bool {
	logger := s.Logger
	if logger == nil {
		logger = NullLogger{}
	}
	if amount <= 0 {
		logger.Error(fmt.Sprintf("invalid amount %g", amount))
		return false
	}
	logger.Info(fmt.Sprintf("charged %g", amount))
	return true
}
