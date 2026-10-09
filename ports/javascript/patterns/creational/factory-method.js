export class Truck {
    kind = 'truck';
    deliver(cargo) {
        return `Truck delivers ${cargo} by road`;
    }
}
export class Ship {
    kind = 'ship';
    deliver(cargo) {
        return `Ship delivers ${cargo} by sea`;
    }
}
export class Logistics {
    planDelivery(cargo) {
        return this.createTransport().deliver(cargo);
    }
}
export class RoadLogistics extends Logistics {
    createTransport() {
        return new Truck();
    }
}
export class SeaLogistics extends Logistics {
    createTransport() {
        return new Ship();
    }
}
const transports = {
    truck: () => new Truck(),
    ship: () => new Ship(),
};
export const createTransport = (kind) => transports[kind]();
