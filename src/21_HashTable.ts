class HashTable {
  private data: { [key: string]: any } = {};

  constructor() {}

  public set(key: string, value: any): void {
    this.data[key] = value;
  }

  public get(key: string): any {
    return this.data[key];
  }

  public has(key: string): boolean {
    return this.data.hasOwnProperty(key);
  }

  public delete(key: string): void {
    delete this.data[key];
  }
}
