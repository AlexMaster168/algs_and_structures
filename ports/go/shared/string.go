package shared

import "unicode/utf16"

func Units(s string) []uint16 { return utf16.Encode([]rune(s)) }
func Text(s []uint16) string  { return string(utf16.Decode(s)) }
