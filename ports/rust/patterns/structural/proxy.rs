use serde_json::{Map, Value};
use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
pub type WeatherFuture<'a> = Pin<Box<dyn Future<Output = Result<f64, String>> + 'a>>;
pub trait WeatherService {
    fn temperature<'a>(&'a mut self, city: &'a str) -> WeatherFuture<'a>;
}
pub struct CachingWeatherProxy<S> {
    service: S,
    ttl_ms: u64,
    now: Box<dyn Fn() -> u64>,
    cache: HashMap<String, (f64, u64)>,
}
impl<S: WeatherService> CachingWeatherProxy<S> {
    pub fn new(service: S, ttl_ms: u64, now: impl Fn() -> u64 + 'static) -> Self {
        Self {
            service,
            ttl_ms,
            now: Box::new(now),
            cache: HashMap::new(),
        }
    }
}
impl<S: WeatherService> WeatherService for CachingWeatherProxy<S> {
    fn temperature<'a>(&'a mut self, city: &'a str) -> WeatherFuture<'a> {
        Box::pin(async move {
            if let Some(&(value, expires)) = self.cache.get(city) {
                if expires > (self.now)() {
                    return Ok(value);
                }
            }
            let value = self.service.temperature(city).await?;
            self.cache
                .insert(city.to_owned(), (value, (self.now)() + self.ttl_ms));
            Ok(value)
        })
    }
}
pub struct AccessControlProxy<S> {
    service: S,
    is_allowed: Box<dyn Fn() -> bool>,
}
impl<S: WeatherService> AccessControlProxy<S> {
    pub fn new(service: S, is_allowed: impl Fn() -> bool + 'static) -> Self {
        Self {
            service,
            is_allowed: Box::new(is_allowed),
        }
    }
}
impl<S: WeatherService> WeatherService for AccessControlProxy<S> {
    fn temperature<'a>(&'a mut self, city: &'a str) -> WeatherFuture<'a> {
        Box::pin(async move {
            if !(self.is_allowed)() {
                return Err("Access denied".into());
            }
            self.service.temperature(city).await
        })
    }
}
pub struct ValidatedObject<'a> {
    target: &'a mut Map<String, Value>,
    validate: Box<dyn Fn(&str, &Value) -> bool + 'a>,
}
impl ValidatedObject<'_> {
    pub fn get(&self, key: &str) -> Option<&Value> {
        self.target.get(key)
    }
    pub fn set(&mut self, key: String, value: Value) -> Result<(), String> {
        if !(self.validate)(&key, &value) {
            return Err(format!("Invalid value for {key}"));
        }
        self.target.insert(key, value);
        Ok(())
    }
}
pub fn create_validated_object<'a>(
    target: &'a mut Map<String, Value>,
    validate: impl Fn(&str, &Value) -> bool + 'a,
) -> ValidatedObject<'a> {
    ValidatedObject {
        target,
        validate: Box::new(validate),
    }
}
