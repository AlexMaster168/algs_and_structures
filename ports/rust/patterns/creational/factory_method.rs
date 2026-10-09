pub trait Transport {
    fn kind(&self) -> &str;
    fn deliver(&self, cargo: &str) -> String;
}
pub struct Truck;
pub struct Ship;
impl Transport for Truck {
    fn kind(&self) -> &str {
        "truck"
    }
    fn deliver(&self, cargo: &str) -> String {
        format!("Truck delivers {cargo} by road")
    }
}
impl Transport for Ship {
    fn kind(&self) -> &str {
        "ship"
    }
    fn deliver(&self, cargo: &str) -> String {
        format!("Ship delivers {cargo} by sea")
    }
}
pub trait Logistics {
    fn create_transport(&self) -> Box<dyn Transport>;
    fn plan_delivery(&self, cargo: &str) -> String {
        self.create_transport().deliver(cargo)
    }
}
pub struct RoadLogistics;
pub struct SeaLogistics;
impl Logistics for RoadLogistics {
    fn create_transport(&self) -> Box<dyn Transport> {
        Box::new(Truck)
    }
}
impl Logistics for SeaLogistics {
    fn create_transport(&self) -> Box<dyn Transport> {
        Box::new(Ship)
    }
}
pub fn create_transport(kind: &str) -> Result<Box<dyn Transport>, String> {
    match kind {
        "truck" => Ok(Box::new(Truck)),
        "ship" => Ok(Box::new(Ship)),
        _ => Err(format!("Unknown transport {kind}")),
    }
}
