use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
#[derive(Default)]
pub struct AppConfig {
    values: HashMap<String, String>,
}
impl AppConfig {
    pub fn get_instance() -> &'static Mutex<Self> {
        static INSTANCE: OnceLock<Mutex<AppConfig>> = OnceLock::new();
        INSTANCE.get_or_init(|| Mutex::new(Self::default()))
    }
    pub fn set(&mut self, key: String, value: String) -> &mut Self {
        self.values.insert(key, value);
        self
    }
    pub fn get(&self, key: &str, fallback: Option<&str>) -> Option<String> {
        self.values
            .get(key)
            .cloned()
            .or_else(|| fallback.map(str::to_owned))
    }
}
pub fn lazy_singleton<T: Clone>(mut create: impl FnMut() -> T) -> impl FnMut() -> T {
    let mut instance = None;
    move || {
        if instance.is_none() {
            instance = Some(create());
        }
        instance.as_ref().unwrap().clone()
    }
}
