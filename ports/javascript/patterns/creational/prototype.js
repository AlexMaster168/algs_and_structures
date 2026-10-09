export class Shape {
    x;
    y;
    color;
    tags;
    constructor(x, y, color, tags = []) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.tags = tags;
    }
}
export class Circle extends Shape {
    radius;
    constructor(x, y, color, radius, tags = []) {
        super(x, y, color, tags);
        this.radius = radius;
    }
    clone() {
        return new Circle(this.x, this.y, this.color, this.radius, [...this.tags]);
    }
    area() {
        return Math.PI * this.radius ** 2;
    }
}
export class Rectangle extends Shape {
    width;
    height;
    constructor(x, y, color, width, height, tags = []) {
        super(x, y, color, tags);
        this.width = width;
        this.height = height;
    }
    clone() {
        return new Rectangle(this.x, this.y, this.color, this.width, this.height, [...this.tags]);
    }
    area() {
        return this.width * this.height;
    }
}
export class PrototypeRegistry {
    prototypes = new Map();
    register(key, prototype) {
        this.prototypes.set(key, prototype);
        return this;
    }
    create(key) {
        const prototype = this.prototypes.get(key);
        if (!prototype)
            throw new Error(`Unknown prototype "${key}"`);
        return prototype.clone();
    }
}
