export class CircleShape {
    radius;
    constructor(radius) {
        this.radius = radius;
    }
    accept(visitor) {
        return visitor.visitCircle(this);
    }
}
export class RectangleShape {
    width;
    height;
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    accept(visitor) {
        return visitor.visitRectangle(this);
    }
}
export class TriangleShape {
    a;
    b;
    c;
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    accept(visitor) {
        return visitor.visitTriangle(this);
    }
}
export class AreaVisitor {
    visitCircle({ radius }) {
        return Math.PI * radius ** 2;
    }
    visitRectangle({ width, height }) {
        return width * height;
    }
    visitTriangle({ a, b, c }) {
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
}
export class PerimeterVisitor {
    visitCircle({ radius }) {
        return 2 * Math.PI * radius;
    }
    visitRectangle({ width, height }) {
        return 2 * (width + height);
    }
    visitTriangle({ a, b, c }) {
        return a + b + c;
    }
}
export class JsonExportVisitor {
    visitCircle({ radius }) {
        return JSON.stringify({ type: 'circle', radius });
    }
    visitRectangle({ width, height }) {
        return JSON.stringify({ type: 'rectangle', width, height });
    }
    visitTriangle({ a, b, c }) {
        return JSON.stringify({ type: 'triangle', sides: [a, b, c] });
    }
}
