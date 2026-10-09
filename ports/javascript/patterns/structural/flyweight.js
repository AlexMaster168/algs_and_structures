export class TreeType {
    name;
    color;
    texture;
    constructor(name, color, texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }
    draw(x, y) {
        return `${this.name}(${this.color}) at ${x},${y}`;
    }
}
export class TreeTypeFactory {
    types = new Map();
    get count() {
        return this.types.size;
    }
    get(name, color, texture) {
        const key = `${name}|${color}|${texture}`;
        let type = this.types.get(key);
        if (!type) {
            type = new TreeType(name, color, texture);
            this.types.set(key, type);
        }
        return type;
    }
}
export class Forest {
    factory;
    trees = [];
    constructor(factory = new TreeTypeFactory()) {
        this.factory = factory;
    }
    get treeCount() {
        return this.trees.length;
    }
    get typeCount() {
        return this.factory.count;
    }
    plant(x, y, name, color, texture) {
        this.trees.push({ x, y, type: this.factory.get(name, color, texture) });
        return this;
    }
    draw() {
        return this.trees.map(({ x, y, type }) => type.draw(x, y));
    }
}
