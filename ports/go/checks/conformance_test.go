package checks

import (
	"algs/data-structures/trees"
	"algs/patterns/architectural"
	"algs/patterns/behavioral"
	"encoding/json"
	"errors"
	"math"
	"math/big"
	"math/rand/v2"
	"os"
	"reflect"
	"sort"
	"strings"
	"testing"
	"unicode"
)

type example struct {
	Source, Name string
	Args         []json.RawMessage
	Expected     json.RawMessage
}

func camelName(name string) string {
	runes := []rune(name)
	for i := 0; i < len(runes); i++ {
		if i > 0 && i+1 < len(runes) && unicode.IsLower(runes[i+1]) {
			break
		}
		runes[i] = unicode.ToLower(runes[i])
		if i+1 < len(runes) && unicode.IsLower(runes[i+1]) {
			break
		}
	}
	return string(runes)
}
func normalized(value reflect.Value) any {
	if !value.IsValid() {
		return nil
	}
	if value.CanInterface() {
		if integer, ok := value.Interface().(*big.Int); ok {
			return integer.String()
		}
	}
	if value.Kind() == reflect.Interface || value.Kind() == reflect.Pointer {
		if value.IsNil() {
			return nil
		}
		return normalized(value.Elem())
	}
	switch value.Kind() {
	case reflect.Struct:
		result := map[string]any{}
		for i := 0; i < value.NumField(); i++ {
			field := value.Type().Field(i)
			if !field.IsExported() {
				continue
			}
			name := camelName(field.Name)
			if tag := strings.Split(field.Tag.Get("json"), ",")[0]; tag != "" {
				name = tag
			}
			result[name] = normalized(value.Field(i))
		}
		return result
	case reflect.Slice, reflect.Array:
		result := []any{}
		for i := 0; i < value.Len(); i++ {
			result = append(result, normalized(value.Index(i)))
		}
		return result
	case reflect.Map:
		if value.Type().Key().Kind() == reflect.String {
			result := map[string]any{}
			for _, key := range value.MapKeys() {
				result[key.String()] = normalized(value.MapIndex(key))
			}
			return result
		}
		keys := value.MapKeys()
		sort.Slice(keys, func(i, j int) bool { return keys[i].Int() < keys[j].Int() })
		result := []any{}
		for _, key := range keys {
			result = append(result, []any{normalized(key), normalized(value.MapIndex(key))})
		}
		return result
	}
	return value.Interface()
}
func equalValue(a, b any) bool {
	switch actual := a.(type) {
	case float64:
		expected, ok := b.(float64)
		return ok && math.Abs(actual-expected) <= 1e-9*math.Max(1, math.Abs(expected))
	case []any:
		expected, ok := b.([]any)
		if !ok || len(actual) != len(expected) {
			return false
		}
		for i, v := range actual {
			if !equalValue(v, expected[i]) {
				return false
			}
		}
		return true
	case map[string]any:
		expected, ok := b.(map[string]any)
		if !ok || len(actual) != len(expected) {
			return false
		}
		for key, v := range actual {
			other, ok := expected[key]
			if !ok || !equalValue(v, other) {
				return false
			}
		}
		return true
	}
	return reflect.DeepEqual(a, b)
}
func TestReferenceCases(t *testing.T) {
	data, error := os.ReadFile("../../golden-cases.json")
	if error != nil {
		t.Fatal(error)
	}
	var cases []example
	if error = json.Unmarshal(data, &cases); error != nil {
		t.Fatal(error)
	}
	for _, sample := range cases {
		t.Run(sample.Name, func(t *testing.T) {
			action, ok := functions[sample.Name]
			if !ok {
				t.Fatal("missing function")
			}
			function := reflect.ValueOf(action)
			kind := function.Type()
			arguments := []reflect.Value{}
			for i, raw := range sample.Args {
				parameter := kind.In(min(i, kind.NumIn()-1))
				if kind.IsVariadic() && i >= kind.NumIn()-1 {
					parameter = parameter.Elem()
				}
				value := reflect.New(parameter)
				if error := json.Unmarshal(raw, value.Interface()); error != nil {
					t.Fatal(error)
				}
				arguments = append(arguments, value.Elem())
			}
			returned := function.Call(arguments)
			var actual any
			if len(returned) == 2 && returned[1].Kind() == reflect.Bool && !returned[1].Bool() {
				actual = nil
			} else {
				actual = normalized(returned[0])
			}
			encoded, error := json.Marshal(actual)
			if error != nil {
				t.Fatal(error)
			}
			var actualValue, expected any
			json.Unmarshal(encoded, &actualValue)
			json.Unmarshal(sample.Expected, &expected)
			if !equalValue(actualValue, expected) {
				t.Fatalf("%s != %s", encoded, sample.Expected)
			}
		})
	}
}
func TestTrees(t *testing.T) {
	redBlack := trees.NewRedBlackTree[int]()
	avl := trees.NewAVLTree[int]()
	bTree := trees.NewBTree[int](2)
	expected := map[int]bool{}
	random := rand.New(rand.NewPCG(168, 71))
	for i := 0; i < 2000; i++ {
		value := random.IntN(300)
		changed := false
		if random.IntN(2) == 0 {
			changed = !expected[value]
			expected[value] = true
			if redBlack.Insert(value) != changed || avl.Insert(value) != changed || bTree.Insert(value) != changed {
				t.Fatal("insert mismatch")
			}
		} else {
			changed = expected[value]
			delete(expected, value)
			if redBlack.Delete(value) != changed || avl.Delete(value) != changed || bTree.Delete(value) != changed {
				t.Fatal("delete mismatch")
			}
		}
		ordered := []int{}
		for value := range expected {
			ordered = append(ordered, value)
		}
		sort.Ints(ordered)
		if !reflect.DeepEqual(redBlack.ToArray(), ordered) || !reflect.DeepEqual(avl.ToArray(), ordered) || !reflect.DeepEqual(bTree.ToArray(), ordered) || !redBlack.IsValid() {
			t.Fatal("tree mismatch")
		}
	}
}
func TestPatterns(t *testing.T) {
	document := &behavioral.TextDocument{}
	history := &behavioral.CommandHistory{}
	history.Run(&behavioral.InsertCommand{Document: document, Position: 0, Text: "abc"})
	if !history.Undo() || document.Content != "" || !history.Redo() || document.Content != "abc" {
		t.Fatal("command history")
	}
	if behavioral.ParseExpression("2+x*3").Interpret(map[string]float64{"x": 4}) != 14 {
		t.Fatal("interpreter")
	}
	order := behavioral.NewOrder()
	order.Pay()
	order.Ship()
	order.Deliver()
	if order.Status() != "delivered" {
		t.Fatal("order")
	}
	container := &architectural.Container{}
	token := architectural.NewToken[*int]("service")
	architectural.Register(container, token, func(*architectural.Container) *int { return new(int) })
	if architectural.Resolve(container, token) != architectural.Resolve(container, token) {
		t.Fatal("singleton")
	}
	events := &architectural.TypedEventEmitter[int]{}
	received := 0
	events.Once("tick", &architectural.Listener[int]{Call: func(value int) { received += value }})
	if events.Emit("tick", 4) != 0 || events.Emit("tick", 4) != 0 || received != 4 {
		t.Fatal("once")
	}
	attempts := 0
	result, error := architectural.Retry(func() (int, error) {
		attempts++
		if attempts < 3 {
			return 0, errors.New("unavailable")
		}
		return 7, nil
	})
	if error != nil || result != 7 || attempts != 3 {
		t.Fatal("retry")
	}
}
