from copy import deepcopy


class InMemoryRepository:
    def __init__(self):
        self.items = {}

    async def find_by_id(self, id):
        return deepcopy(self.items.get(id))

    async def find_all(self, specification=None):
        return [deepcopy(item) for item in self.items.values() if specification is None or specification.is_satisfied_by(item)]

    async def save(self, entity):
        key = entity['id'] if isinstance(entity, dict) else entity.id
        self.items[key] = deepcopy(entity)

    async def delete(self, id):
        if id not in self.items:
            return False
        del self.items[id]
        return True
