<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;

interface Logger { public function info(string $message): void; public function error(string $message): void; }
class MemoryLogger implements Logger { public array $lines = []; public function info(string $message): void { $this->lines[] = "INFO $message"; } public function error(string $message): void { $this->lines[] = "ERROR $message"; } }
class NullLogger implements Logger { public function info(string $message): void {} public function error(string $message): void {} }
class PaymentService {
    public function __construct(private Logger $logger = new NullLogger()) {}
    public function charge(int|float $amount): bool { if ($amount <= 0) { $this->logger->error("invalid amount $amount"); return false; } $this->logger->info("charged $amount"); return true; }
}
