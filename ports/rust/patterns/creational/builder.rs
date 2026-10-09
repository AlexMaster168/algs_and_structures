use serde_json::Value;
use std::collections::BTreeMap;
#[derive(Clone)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: BTreeMap<String, String>,
    pub body: Option<String>,
    pub timeout_ms: u64,
}
pub struct HttpRequestBuilder {
    method: String,
    base_url: String,
    query: Vec<(String, String)>,
    headers: BTreeMap<String, String>,
    body: Option<String>,
    timeout_ms: u64,
}
impl Default for HttpRequestBuilder {
    fn default() -> Self {
        Self {
            method: "GET".into(),
            base_url: String::new(),
            query: Vec::new(),
            headers: BTreeMap::new(),
            body: None,
            timeout_ms: 30000,
        }
    }
}
impl HttpRequestBuilder {
    pub fn get(url: impl Into<String>) -> Self {
        let mut builder = Self::default();
        builder.url(url);
        builder
    }
    pub fn post(url: impl Into<String>) -> Self {
        let mut builder = Self::get(url);
        builder.with_method("POST");
        builder
    }
    pub fn url(&mut self, url: impl Into<String>) -> &mut Self {
        self.base_url = url.into();
        self
    }
    pub fn with_method(&mut self, method: impl Into<String>) -> &mut Self {
        self.method = method.into();
        self
    }
    pub fn header(&mut self, name: &str, value: impl Into<String>) -> &mut Self {
        self.headers.insert(name.to_lowercase(), value.into());
        self
    }
    pub fn param(&mut self, name: impl Into<String>, value: impl ToString) -> &mut Self {
        self.query.push((name.into(), value.to_string()));
        self
    }
    pub fn json(&mut self, payload: &Value) -> &mut Self {
        self.body = Some(payload.to_string());
        self.header("content-type", "application/json")
    }
    pub fn timeout(&mut self, ms: u64) -> &mut Self {
        self.timeout_ms = ms;
        self
    }
    pub fn build(&self) -> Result<HttpRequest, String> {
        if self.base_url.is_empty() {
            return Err("URL is required".into());
        }
        if self.method == "GET" && self.body.is_some() {
            return Err("GET request cannot have a body".into());
        }
        fn encode(text: &str) -> String {
            let mut result = String::new();
            for byte in text.bytes() {
                if byte.is_ascii_alphanumeric() || b"*-._".contains(&byte) {
                    result.push(byte as char);
                } else if byte == b' ' {
                    result.push('+');
                } else {
                    result.push_str(&format!("%{byte:02X}"));
                }
            }
            result
        }
        let query = self
            .query
            .iter()
            .map(|(name, value)| format!("{}={}", encode(name), encode(value)))
            .collect::<Vec<_>>()
            .join("&");
        Ok(HttpRequest {
            method: self.method.clone(),
            url: if query.is_empty() {
                self.base_url.clone()
            } else {
                format!("{}?{query}", self.base_url)
            },
            headers: self.headers.clone(),
            body: self.body.clone(),
            timeout_ms: self.timeout_ms,
        })
    }
}
