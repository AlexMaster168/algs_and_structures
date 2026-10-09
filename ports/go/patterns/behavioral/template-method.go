package behavioral

import (
	"encoding/json"
	"math"
	"strconv"
	"strings"
)

type SalesRecord struct {
	Product string  `json:"product"`
	Amount  float64 `json:"amount"`
}
type SalesReport struct {
	Total      float64
	TopProduct *string
	Records    int
}
type SalesDataMiner struct {
	Parse   func(string) []SalesRecord
	IsValid func(SalesRecord) bool
	Report  func([]SalesRecord) SalesReport
}

func (m SalesDataMiner) Mine(raw string) SalesReport {
	valid := m.IsValid
	if valid == nil {
		valid = func(r SalesRecord) bool {
			return r.Product != "" && !math.IsNaN(r.Amount) && !math.IsInf(r.Amount, 0) && r.Amount >= 0
		}
	}
	records := []SalesRecord{}
	for _, record := range m.Parse(raw) {
		if valid(record) {
			records = append(records, record)
		}
	}
	if m.Report != nil {
		return m.Report(records)
	}
	totals := map[string]float64{}
	order := []string{}
	report := SalesReport{Records: len(records)}
	for _, r := range records {
		if _, ok := totals[r.Product]; !ok {
			order = append(order, r.Product)
		}
		totals[r.Product] += r.Amount
		report.Total += r.Amount
	}
	for _, product := range order {
		if report.TopProduct == nil || totals[product] > totals[*report.TopProduct] {
			value := product
			report.TopProduct = &value
		}
	}
	return report
}

type CsvSalesMiner struct{}

func (CsvSalesMiner) Mine(raw string) SalesReport {
	return SalesDataMiner{Parse: func(raw string) []SalesRecord {
		lines := strings.Split(strings.TrimSpace(raw), "\n")
		records := []SalesRecord{}
		for _, line := range lines[1:] {
			fields := strings.Split(line, ",")
			amount := ""
			if len(fields) > 1 {
				amount = strings.TrimSpace(fields[1])
			}
			value := 0.0
			if amount != "" {
				parsed, error := strconv.ParseFloat(amount, 64)
				if error != nil {
					value = math.NaN()
				} else {
					value = parsed
				}
			}
			records = append(records, SalesRecord{strings.TrimSpace(fields[0]), value})
		}
		return records
	}}.Mine(raw)
}

type JsonSalesMiner struct{}

func (JsonSalesMiner) Mine(raw string) SalesReport {
	return SalesDataMiner{Parse: func(raw string) []SalesRecord {
		records := []SalesRecord{}
		if error := json.Unmarshal([]byte(raw), &records); error != nil {
			panic(error)
		}
		return records
	}}.Mine(raw)
}
