from abc import ABC, abstractmethod


class Truck:
    kind = 'truck'

    def deliver(self, cargo):
        return f'Truck delivers {cargo} by road'


class Ship:
    kind = 'ship'

    def deliver(self, cargo):
        return f'Ship delivers {cargo} by sea'


class Logistics(ABC):
    @abstractmethod
    def create_transport(self):
        raise NotImplementedError

    def plan_delivery(self, cargo):
        return self.create_transport().deliver(cargo)


class RoadLogistics(Logistics):
    def create_transport(self):
        return Truck()


class SeaLogistics(Logistics):
    def create_transport(self):
        return Ship()


def create_transport(kind):
    return {'truck': Truck, 'ship': Ship}[kind]()
