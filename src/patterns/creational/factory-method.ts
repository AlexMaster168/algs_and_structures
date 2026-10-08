export interface Transport {
  readonly kind: string;
  deliver(cargo: string): string;
}

export class Truck implements Transport {
  readonly kind = 'truck';

  deliver(cargo: string): string {
    return `Truck delivers ${cargo} by road`;
  }
}

export class Ship implements Transport {
  readonly kind = 'ship';

  deliver(cargo: string): string {
    return `Ship delivers ${cargo} by sea`;
  }
}

export abstract class Logistics {
  protected abstract createTransport(): Transport;

  planDelivery(cargo: string): string {
    return this.createTransport().deliver(cargo);
  }
}

export class RoadLogistics extends Logistics {
  protected createTransport(): Transport {
    return new Truck();
  }
}

export class SeaLogistics extends Logistics {
  protected createTransport(): Transport {
    return new Ship();
  }
}

const transports = {
  truck: () => new Truck(),
  ship: () => new Ship(),
} satisfies Record<string, () => Transport>;

export type TransportKind = keyof typeof transports;

export const createTransport = (kind: TransportKind): Transport => transports[kind]();
