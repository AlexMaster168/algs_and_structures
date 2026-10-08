import type { Specification } from './specification.js';

export interface Entity {
  id: string;
}

export interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(specification?: Specification<T>): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryRepository<T extends Entity> implements Repository<T> {
  private readonly items = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    const item = this.items.get(id);
    return item ? structuredClone(item) : null;
  }

  async findAll(specification?: Specification<T>): Promise<T[]> {
    return [...this.items.values()]
      .filter((item) => !specification || specification.isSatisfiedBy(item))
      .map((item) => structuredClone(item));
  }

  async save(entity: T): Promise<void> {
    this.items.set(entity.id, structuredClone(entity));
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
