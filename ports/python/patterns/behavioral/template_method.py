import json
import math
from abc import ABC, abstractmethod


class SalesDataMiner(ABC):
    def mine(self, raw):
        return self.report([record for record in self.parse(raw) if self.is_valid(record)])

    @abstractmethod
    def parse(self, raw):
        raise NotImplementedError

    def is_valid(self, record):
        return bool(record['product']) and math.isfinite(record['amount']) and record['amount'] >= 0

    def report(self, records):
        totals = {}
        for record in records:
            product = record['product']
            totals[product] = totals.get(product, 0) + record['amount']
        return {'total': sum(record['amount'] for record in records), 'topProduct': max(totals, key=totals.get) if totals else None, 'records': len(records)}


class CsvSalesMiner(SalesDataMiner):
    def parse(self, raw):
        records = []
        for line in raw.strip().split('\n')[1:]:
            parts = line.split(',')
            try:
                amount = float(parts[1].strip() or 0) if len(parts) > 1 else 0
            except ValueError:
                amount = float('nan')
            records.append({'product': parts[0].strip(), 'amount': amount})
        return records


class JsonSalesMiner(SalesDataMiner):
    def parse(self, raw):
        return json.loads(raw)
