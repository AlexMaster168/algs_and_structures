use serde_json::Value;
pub trait Notifier {
    fn send(&self, message: &str) -> Vec<String>;
}
pub struct EmailNotifier {
    email: String,
}
impl EmailNotifier {
    pub fn new(email: String) -> Self {
        Self { email }
    }
}
impl Notifier for EmailNotifier {
    fn send(&self, message: &str) -> Vec<String> {
        vec![format!("email to {}: {message}", self.email)]
    }
}
pub struct NotifierDecorator {
    pub wrapped: Box<dyn Notifier>,
}
impl NotifierDecorator {
    pub fn new(wrapped: Box<dyn Notifier>) -> Self {
        Self { wrapped }
    }
}
impl Notifier for NotifierDecorator {
    fn send(&self, message: &str) -> Vec<String> {
        self.wrapped.send(message)
    }
}
pub struct SmsNotifier {
    wrapped: NotifierDecorator,
    phone: String,
}
impl SmsNotifier {
    pub fn new(wrapped: Box<dyn Notifier>, phone: String) -> Self {
        Self {
            wrapped: NotifierDecorator::new(wrapped),
            phone,
        }
    }
}
impl Notifier for SmsNotifier {
    fn send(&self, message: &str) -> Vec<String> {
        let mut lines = self.wrapped.send(message);
        lines.push(format!("sms to {}: {message}", self.phone));
        lines
    }
}
pub struct SlackNotifier {
    wrapped: NotifierDecorator,
    channel: String,
}
impl SlackNotifier {
    pub fn new(wrapped: Box<dyn Notifier>, channel: String) -> Self {
        Self {
            wrapped: NotifierDecorator::new(wrapped),
            channel,
        }
    }
}
impl Notifier for SlackNotifier {
    fn send(&self, message: &str) -> Vec<String> {
        let mut lines = self.wrapped.send(message);
        lines.push(format!("slack #{}: {message}", self.channel));
        lines
    }
}
pub fn with_logging(
    mut function: impl FnMut(Vec<Value>) -> Value,
    mut log: impl FnMut(String),
    name: String,
) -> impl FnMut(Vec<Value>) -> Value {
    move |args| {
        log(format!(
            "{name}({})",
            args.iter()
                .map(Value::to_string)
                .collect::<Vec<_>>()
                .join(", ")
        ));
        let result = function(args);
        log(format!("{name} -> {result}"));
        result
    }
}
