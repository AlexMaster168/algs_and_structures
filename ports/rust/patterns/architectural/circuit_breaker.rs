use std::future::Future;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
#[derive(Debug, Clone, Copy)]
pub struct CircuitOpenError;
impl std::fmt::Display for CircuitOpenError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Circuit is open")
    }
}
impl std::error::Error for CircuitOpenError {}
#[derive(Debug)]
pub enum CircuitError<E> {
    Open(CircuitOpenError),
    Action(E),
}
pub struct CircuitBreakerOptions {
    pub failure_threshold: usize,
    pub reset_timeout_ms: u64,
    pub now: Box<dyn Fn() -> u64>,
}
impl Default for CircuitBreakerOptions {
    fn default() -> Self {
        Self {
            failure_threshold: 3,
            reset_timeout_ms: 10000,
            now: Box::new(|| {
                SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_millis() as u64
            }),
        }
    }
}
pub struct CircuitBreaker<F> {
    action: F,
    options: CircuitBreakerOptions,
    failures: usize,
    opened_at: u64,
    current: &'static str,
}
impl<F> CircuitBreaker<F> {
    pub fn new(action: F, options: CircuitBreakerOptions) -> Self {
        Self {
            action,
            options,
            failures: 0,
            opened_at: 0,
            current: "closed",
        }
    }
    pub fn state(&mut self) -> &str {
        if self.current == "open"
            && (self.options.now)().saturating_sub(self.opened_at) >= self.options.reset_timeout_ms
        {
            self.current = "half-open";
        }
        self.current
    }
    pub async fn call<A, R, E, Fut>(&mut self, args: A) -> Result<R, CircuitError<E>>
    where
        F: FnMut(A) -> Fut,
        Fut: Future<Output = Result<R, E>>,
    {
        if self.state() == "open" {
            return Err(CircuitError::Open(CircuitOpenError));
        }
        match (self.action)(args).await {
            Ok(value) => {
                self.failures = 0;
                self.current = "closed";
                Ok(value)
            }
            Err(error) => {
                self.failures += 1;
                if self.current == "half-open" || self.failures >= self.options.failure_threshold {
                    self.current = "open";
                    self.opened_at = (self.options.now)();
                }
                Err(CircuitError::Action(error))
            }
        }
    }
}
pub struct RetryOptions {
    pub attempts: usize,
    pub delay_ms: f64,
    pub factor: f64,
}
impl Default for RetryOptions {
    fn default() -> Self {
        Self {
            attempts: 3,
            delay_ms: 0.0,
            factor: 2.0,
        }
    }
}
pub async fn retry<R, E, Fut: Future<Output = Result<R, E>>>(
    mut action: impl FnMut() -> Fut,
    options: RetryOptions,
) -> Result<R, E> {
    assert!(options.attempts > 0);
    for attempt in 0..options.attempts {
        match action().await {
            Ok(value) => return Ok(value),
            Err(error) => {
                if attempt + 1 == options.attempts {
                    return Err(error);
                }
                if options.delay_ms > 0.0 {
                    std::thread::sleep(Duration::from_secs_f64(
                        options.delay_ms * options.factor.powi(attempt as i32) / 1000.0,
                    ));
                }
            }
        }
    }
    unreachable!()
}
