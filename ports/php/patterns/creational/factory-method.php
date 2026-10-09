<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

interface Transport { public function deliver(string $cargo): string; }
class Truck implements Transport { public readonly string $kind; public function __construct() { $this->kind = 'truck'; } public function deliver(string $cargo): string { return "Truck delivers $cargo by road"; } }
class Ship implements Transport { public readonly string $kind; public function __construct() { $this->kind = 'ship'; } public function deliver(string $cargo): string { return "Ship delivers $cargo by sea"; } }
abstract class Logistics { abstract protected function createTransport(): Transport; public function planDelivery(string $cargo): string { return $this->createTransport()->deliver($cargo); } }
class RoadLogistics extends Logistics { protected function createTransport(): Transport { return new Truck(); } }
class SeaLogistics extends Logistics { protected function createTransport(): Transport { return new Ship(); } }
function createTransport(string $kind): Transport { return match($kind) { 'truck' => new Truck(), 'ship' => new Ship(), default => throw new \InvalidArgumentException('Unknown transport') }; }
