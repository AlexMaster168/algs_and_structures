export class InMemoryRepository {
    items = new Map();
    async findById(id) {
        const item = this.items.get(id);
        return item ? structuredClone(item) : null;
    }
    async findAll(specification) {
        return [...this.items.values()]
            .filter((item) => !specification || specification.isSatisfiedBy(item))
            .map((item) => structuredClone(item));
    }
    async save(entity) {
        this.items.set(entity.id, structuredClone(entity));
    }
    async delete(id) {
        return this.items.delete(id);
    }
}
