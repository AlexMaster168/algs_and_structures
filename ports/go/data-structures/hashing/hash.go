package hashing

import (
	"algs/shared"
	"fmt"
	"reflect"
)

func FNV1a(s string, seeds ...uint32) uint32 {
	h := uint32(0x811c9dc5)
	if len(seeds) > 0 {
		h = seeds[0]
	}
	for _, c := range shared.Units(s) {
		h ^= uint32(c)
		h *= 0x01000193
	}
	return h
}
func DefaultHasher[K any](k K) uint32 {
	kind := "object"
	if any(k) != nil {
		switch reflect.TypeOf(k).Kind() {
		case reflect.String:
			kind = "string"
		case reflect.Bool:
			kind = "boolean"
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64:
			kind = "number"
		}
	}
	return FNV1a(fmt.Sprintf("%s:%v", kind, k))
}

type Entry[K, V any] struct {
	Key   K
	Value V
}
