use std::collections::HashMap;
pub struct SalesRecord {
    pub product: String,
    pub amount: f64,
}
pub struct SalesReport {
    pub total: f64,
    pub top_product: Option<String>,
    pub records: usize,
}
pub trait SalesDataMiner {
    fn parse(&self, raw: &str) -> Result<Vec<SalesRecord>, String>;
    fn is_valid(&self, record: &SalesRecord) -> bool {
        !record.product.is_empty() && record.amount.is_finite() && record.amount >= 0.0
    }
    fn report(&self, records: &[SalesRecord]) -> SalesReport {
        let mut totals = HashMap::<&str, f64>::new();
        let mut order = Vec::new();
        let mut total = 0.0;
        for record in records {
            if !totals.contains_key(record.product.as_str()) {
                order.push(record.product.as_str());
            }
            *totals.entry(&record.product).or_default() += record.amount;
            total += record.amount;
        }
        let mut top = None;
        for product in order {
            if top.is_none_or(|best| totals[product] > totals[best]) {
                top = Some(product);
            }
        }
        SalesReport {
            total,
            top_product: top.map(str::to_owned),
            records: records.len(),
        }
    }
    fn mine(&self, raw: &str) -> Result<SalesReport, String> {
        let records: Vec<_> = self
            .parse(raw)?
            .into_iter()
            .filter(|record| self.is_valid(record))
            .collect();
        Ok(self.report(&records))
    }
}
pub struct CsvSalesMiner;
impl SalesDataMiner for CsvSalesMiner {
    fn parse(&self, raw: &str) -> Result<Vec<SalesRecord>, String> {
        Ok(raw
            .trim()
            .split('\n')
            .skip(1)
            .map(|line| {
                let mut columns = line.split(',');
                let product = columns.next().unwrap_or("").trim().to_owned();
                let amount = columns.next().unwrap_or("").trim();
                SalesRecord {
                    product,
                    amount: if amount.is_empty() {
                        0.0
                    } else {
                        amount.parse().unwrap_or(f64::NAN)
                    },
                }
            })
            .collect())
    }
}
pub struct JsonSalesMiner;
impl SalesDataMiner for JsonSalesMiner {
    fn parse(&self, raw: &str) -> Result<Vec<SalesRecord>, String> {
        let value: serde_json::Value =
            serde_json::from_str(raw).map_err(|error| error.to_string())?;
        let records = value.as_array().ok_or("Expected sales array")?;
        Ok(records
            .iter()
            .map(|record| SalesRecord {
                product: record["product"].as_str().unwrap_or("").to_owned(),
                amount: record["amount"].as_f64().unwrap_or(f64::NAN),
            })
            .collect())
    }
}
