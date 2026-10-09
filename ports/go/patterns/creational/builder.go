package creational

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
)

type HttpRequest struct {
	Method, URL string
	Headers     map[string]string
	Body        *string
	TimeoutMs   float64
}
type HttpRequestBuilder struct {
	method, baseURL string
	query           [][2]string
	headers         map[string]string
	body            *string
	timeoutMs       float64
}

func NewHttpRequestBuilder() *HttpRequestBuilder {
	return &HttpRequestBuilder{method: "GET", headers: map[string]string{}, timeoutMs: 30000}
}
func GetRequest(address string) *HttpRequestBuilder { return NewHttpRequestBuilder().URL(address) }
func PostRequest(address string) *HttpRequestBuilder {
	return NewHttpRequestBuilder().URL(address).WithMethod("POST")
}
func (b *HttpRequestBuilder) URL(value string) *HttpRequestBuilder        { b.baseURL = value; return b }
func (b *HttpRequestBuilder) WithMethod(value string) *HttpRequestBuilder { b.method = value; return b }
func (b *HttpRequestBuilder) Header(name, value string) *HttpRequestBuilder {
	b.headers[strings.ToLower(name)] = value
	return b
}
func (b *HttpRequestBuilder) Param(name string, value any) *HttpRequestBuilder {
	b.query = append(b.query, [2]string{name, fmt.Sprint(value)})
	return b
}
func (b *HttpRequestBuilder) JSON(payload any) *HttpRequestBuilder {
	encoded, error := json.Marshal(payload)
	if error != nil {
		panic(error)
	}
	value := string(encoded)
	b.body = &value
	return b.Header("content-type", "application/json")
}
func (b *HttpRequestBuilder) Timeout(value float64) *HttpRequestBuilder {
	b.timeoutMs = value
	return b
}
func (b *HttpRequestBuilder) Build() HttpRequest {
	if b.baseURL == "" {
		panic("URL is required")
	}
	if b.body != nil && b.method == "GET" {
		panic("GET request cannot have a body")
	}
	query := []string{}
	for _, pair := range b.query {
		query = append(query, url.QueryEscape(pair[0])+"="+url.QueryEscape(pair[1]))
	}
	address := b.baseURL
	if len(query) > 0 {
		address += "?" + strings.Join(query, "&")
	}
	headers := map[string]string{}
	for key, value := range b.headers {
		headers[key] = value
	}
	var body *string
	if b.body != nil {
		value := *b.body
		body = &value
	}
	return HttpRequest{b.method, address, headers, body, b.timeoutMs}
}
