<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

abstract class SalesDataMiner {
    public function mine(string $raw): array { return $this->report(array_values(array_filter($this->parse($raw), $this->isValid(...)))); }
    abstract protected function parse(string $raw): array;
    protected function isValid(array $record): bool { return strlen($record['product']) > 0 && is_finite((float)$record['amount']) && $record['amount'] >= 0; }
    protected function report(array $records): array {
        $totals = []; $total = 0; foreach ($records as $record) { $total += $record['amount']; $totals[$record['product']] = ($totals[$record['product']] ?? 0) + $record['amount']; }
        $top = null; foreach ($totals as $product => $amount) if ($top === null || $amount > $totals[$top]) $top = $product;
        return ['total' => $total, 'topProduct' => $top, 'records' => count($records)];
    }
}
class CsvSalesMiner extends SalesDataMiner {
    protected function parse(string $raw): array { return array_map(function($line): array { $fields = explode(',', $line); $amount = trim($fields[1] ?? ''); return ['product' => trim($fields[0]), 'amount' => $amount === '' ? 0 : (is_numeric($amount) ? (float)$amount : NAN)]; }, array_slice(explode("\n", trim($raw)), 1)); }
}
class JsonSalesMiner extends SalesDataMiner { protected function parse(string $raw): array { return json_decode($raw, true, 512, JSON_THROW_ON_ERROR); } }
