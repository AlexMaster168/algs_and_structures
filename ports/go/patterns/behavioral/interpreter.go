package behavioral

import (
	"regexp"
	"strconv"
)

type Expression interface {
	Interpret(map[string]float64) float64
}
type NumberExpression struct{ Value float64 }

func (e NumberExpression) Interpret(map[string]float64) float64 { return e.Value }

type VariableExpression struct{ Name string }

func (e VariableExpression) Interpret(context map[string]float64) float64 {
	value, ok := context[e.Name]
	if !ok {
		panic("unknown variable " + e.Name)
	}
	return value
}

type BinaryExpression struct {
	Operator    string
	Left, Right Expression
}

func (e BinaryExpression) Interpret(context map[string]float64) float64 {
	a, b := e.Left.Interpret(context), e.Right.Interpret(context)
	switch e.Operator {
	case "+":
		return a + b
	case "-":
		return a - b
	case "*":
		return a * b
	case "/":
		return a / b
	default:
		panic("unknown operator")
	}
}
func ParseExpression(source string) Expression {
	tokens := regexp.MustCompile(`\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/()]`).FindAllString(source, -1)
	position := 0
	peek := func() string {
		if position == len(tokens) {
			return ""
		}
		return tokens[position]
	}
	consume := func() string {
		if position == len(tokens) {
			panic("unexpected end")
		}
		value := tokens[position]
		position++
		return value
	}
	var sum func() Expression
	primary := func() Expression {
		token := consume()
		if token == "(" {
			inner := sum()
			if consume() != ")" {
				panic("expected )")
			}
			return inner
		}
		if value, error := strconv.ParseFloat(token, 64); error == nil {
			return NumberExpression{value}
		}
		if token[0] >= 'A' && token[0] <= 'Z' || token[0] >= 'a' && token[0] <= 'z' || token[0] == '_' {
			return VariableExpression{token}
		}
		panic("unexpected token")
	}
	product := func() Expression {
		value := primary()
		for peek() == "*" || peek() == "/" {
			value = BinaryExpression{consume(), value, primary()}
		}
		return value
	}
	sum = func() Expression {
		value := product()
		for peek() == "+" || peek() == "-" {
			value = BinaryExpression{consume(), value, product()}
		}
		return value
	}
	value := sum()
	if position != len(tokens) {
		panic("unexpected token")
	}
	return value
}
