export class SalesDataMiner {
    mine(raw) {
        const records = this.parse(raw).filter((record) => this.isValid(record));
        return this.report(records);
    }
    isValid(record) {
        return record.product.length > 0 && Number.isFinite(record.amount) && record.amount >= 0;
    }
    report(records) {
        const totals = new Map();
        for (const { product, amount } of records)
            totals.set(product, (totals.get(product) ?? 0) + amount);
        let topProduct = null;
        for (const [product, amount] of totals) {
            if (topProduct === null || amount > totals.get(topProduct))
                topProduct = product;
        }
        return { total: records.reduce((sum, record) => sum + record.amount, 0), topProduct, records: records.length };
    }
}
export class CsvSalesMiner extends SalesDataMiner {
    parse(raw) {
        return raw
            .trim()
            .split('\n')
            .slice(1)
            .map((line) => {
            const [product = '', amount = ''] = line.split(',');
            return { product: product.trim(), amount: Number(amount) };
        });
    }
}
export class JsonSalesMiner extends SalesDataMiner {
    parse(raw) {
        return JSON.parse(raw);
    }
}
