package structural

import (
	"encoding/json"
	"fmt"
)

type Notifier interface{ Send(string) []string }
type EmailNotifier struct{ Email string }

func (n EmailNotifier) Send(message string) []string {
	return []string{"email to " + n.Email + ": " + message}
}

type NotifierDecorator struct{ Wrapped Notifier }

func (n NotifierDecorator) Send(message string) []string { return n.Wrapped.Send(message) }

type SmsNotifier struct {
	NotifierDecorator
	Phone string
}

func (n SmsNotifier) Send(message string) []string {
	return append(n.NotifierDecorator.Send(message), "sms to "+n.Phone+": "+message)
}

type SlackNotifier struct {
	NotifierDecorator
	Channel string
}

func (n SlackNotifier) Send(message string) []string {
	return append(n.NotifierDecorator.Send(message), "slack #"+n.Channel+": "+message)
}
func WithLogging[A, R any](action func(A) R, log func(string), names ...string) func(A) R {
	name := "anonymous"
	if len(names) > 0 {
		name = names[0]
	}
	encode := func(value any) string {
		data, error := json.Marshal(value)
		if error != nil {
			panic(error)
		}
		return string(data)
	}
	return func(argument A) R {
		log(fmt.Sprintf("%s(%s)", name, encode(argument)))
		result := action(argument)
		log(fmt.Sprintf("%s -> %s", name, encode(result)))
		return result
	}
}
