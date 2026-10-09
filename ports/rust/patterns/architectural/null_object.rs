use std::cell::RefCell;
use std::rc::Rc;
pub trait Logger {
    fn info(&self, message: &str);
    fn error(&self, message: &str);
}
#[derive(Default)]
pub struct MemoryLogger {
    pub lines: RefCell<Vec<String>>,
}
impl Logger for MemoryLogger {
    fn info(&self, message: &str) {
        self.lines.borrow_mut().push(format!("INFO {message}"));
    }
    fn error(&self, message: &str) {
        self.lines.borrow_mut().push(format!("ERROR {message}"));
    }
}
pub struct NullLogger;
impl Logger for NullLogger {
    fn info(&self, _: &str) {}
    fn error(&self, _: &str) {}
}
pub struct PaymentService {
    logger: Rc<dyn Logger>,
}
impl Default for PaymentService {
    fn default() -> Self {
        Self::new(Rc::new(NullLogger))
    }
}
impl PaymentService {
    pub fn new(logger: Rc<dyn Logger>) -> Self {
        Self { logger }
    }
    pub fn charge(&self, amount: f64) -> bool {
        if amount <= 0.0 {
            self.logger.error(&format!("invalid amount {amount}"));
            false
        } else {
            self.logger.info(&format!("charged {amount}"));
            true
        }
    }
}
