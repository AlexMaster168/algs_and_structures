export interface SalesRecord {
  product: string;
  amount: number;
}

export interface SalesReport {
  total: number;
  topProduct: string | null;
  records: number;
}

export abstract class SalesDataMiner {
  mine(raw: string): SalesReport {
    const records = this.parse(raw).filter((record) => this.isValid(record));
    return this.report(records);
  }

  protected abstract parse(raw: string): SalesRecord[];

  protected isValid(record: SalesRecord): boolean {
    return record.product.length > 0 && Number.isFinite(record.amount) && record.amount >= 0;
  }

  protected report(records: SalesRecord[]): SalesReport {
    const totals = new Map<string, number>();
    for (const { product, amount } of records) totals.set(product, (totals.get(product) ?? 0) + amount);

    let topProduct: string | null = null;
    for (const [product, amount] of totals) {
      if (topProduct === null || amount > totals.get(topProduct)!) topProduct = product;
    }

    return { total: records.reduce((sum, record) => sum + record.amount, 0), topProduct, records: records.length };
  }
}

export class CsvSalesMiner extends SalesDataMiner {
  protected parse(raw: string): SalesRecord[] {
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
  protected parse(raw: string): SalesRecord[] {
    return JSON.parse(raw) as SalesRecord[];
  }
}
