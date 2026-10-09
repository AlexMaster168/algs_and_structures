pub trait TemperatureSensor {
    fn celsius(&self) -> f64;
}
pub struct LegacyFahrenheitSensor {
    reading: f64,
}
impl LegacyFahrenheitSensor {
    pub fn new(reading: f64) -> Self {
        Self { reading }
    }
    pub fn read_fahrenheit(&self) -> f64 {
        self.reading
    }
}
pub struct FahrenheitSensorAdapter {
    legacy: LegacyFahrenheitSensor,
}
impl FahrenheitSensorAdapter {
    pub fn new(legacy: LegacyFahrenheitSensor) -> Self {
        Self { legacy }
    }
}
impl TemperatureSensor for FahrenheitSensorAdapter {
    fn celsius(&self) -> f64 {
        (((self.legacy.read_fahrenheit() - 32.0) * 50.0 / 9.0) + 0.5).floor() / 10.0
    }
}
pub fn average_temperature(sensors: &[&dyn TemperatureSensor]) -> f64 {
    sensors.iter().map(|sensor| sensor.celsius()).sum::<f64>() / sensors.len() as f64
}
pub fn promisify<A, T: Send + 'static>(
    function: impl Fn(A, Box<dyn FnOnce(Result<T, String>) + Send>),
) -> impl Fn(A) -> std::sync::mpsc::Receiver<Result<T, String>> {
    move |args| {
        let (sender, receiver) = std::sync::mpsc::channel();
        function(
            args,
            Box::new(move |result| {
                let _ = sender.send(result);
            }),
        );
        receiver
    }
}
