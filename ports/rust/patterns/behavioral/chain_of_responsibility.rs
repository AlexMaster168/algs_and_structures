pub struct Ticket {
    pub topic: String,
    pub severity: u8,
}
pub trait SupportHandler {
    fn set_next(&mut self, handler: Box<dyn SupportHandler>) -> &mut dyn SupportHandler;
    fn handle(&self, ticket: &Ticket) -> String;
}
#[derive(Default)]
pub struct FaqBot {
    next: Option<Box<dyn SupportHandler>>,
}
#[derive(Default)]
pub struct SupportAgent {
    next: Option<Box<dyn SupportHandler>>,
}
#[derive(Default)]
pub struct Engineer {
    next: Option<Box<dyn SupportHandler>>,
}
macro_rules! handler {
    ($type:ty,$can:expr,$resolve:expr) => {
        impl SupportHandler for $type {
            fn set_next(&mut self, handler: Box<dyn SupportHandler>) -> &mut dyn SupportHandler {
                self.next = Some(handler);
                self.next.as_deref_mut().unwrap()
            }
            fn handle(&self, ticket: &Ticket) -> String {
                if ($can)(ticket) {
                    ($resolve)(ticket)
                } else if let Some(next) = &self.next {
                    next.handle(ticket)
                } else {
                    format!("Unresolved: {}", ticket.topic)
                }
            }
        }
    };
}
handler!(
    FaqBot,
    |ticket: &Ticket| ticket.severity == 1
        && matches!(ticket.topic.as_str(), "password" | "delivery"),
    |ticket: &Ticket| if ticket.topic == "password" {
        "Bot: Use the \"Forgot password\" link".into()
    } else {
        "Bot: Delivery takes 3-5 days".into()
    }
);
handler!(
    SupportAgent,
    |ticket: &Ticket| ticket.severity <= 2,
    |ticket: &Ticket| format!("Agent resolved {}", ticket.topic)
);
handler!(Engineer, |_: &Ticket| true, |ticket: &Ticket| format!(
    "Engineer fixed {}",
    ticket.topic
));
pub fn create_support_chain() -> Box<dyn SupportHandler> {
    let mut bot = FaqBot::default();
    bot.set_next(Box::new(SupportAgent::default()))
        .set_next(Box::new(Engineer::default()));
    Box::new(bot)
}
