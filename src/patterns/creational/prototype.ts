export interface Prototype<T> {
  clone(): T;
}

export abstract class Shape implements Prototype<Shape> {
  constructor(
    public x: number,
    public y: number,
    public color: string,
    public tags: string[] = [],
  ) {}

  abstract clone(): Shape;
  abstract area(): number;
}

export class Circle extends Shape {
  constructor(
    x: number,
    y: number,
    color: string,
    public radius: number,
    tags: string[] = [],
  ) {
    super(x, y, color, tags);
  }

  clone(): Circle {
    return new Circle(this.x, this.y, this.color, this.radius, [...this.tags]);
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

export class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    color: string,
    public width: number,
    public height: number,
    tags: string[] = [],
  ) {
    super(x, y, color, tags);
  }

  clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.color, this.width, this.height, [...this.tags]);
  }

  area(): number {
    return this.width * this.height;
  }
}

export class PrototypeRegistry<T extends Prototype<T>> {
  private readonly prototypes = new Map<string, T>();

  register(key: string, prototype: T): this {
    this.prototypes.set(key, prototype);
    return this;
  }

  create(key: string): T {
    const prototype = this.prototypes.get(key);
    if (!prototype) throw new Error(`Unknown prototype "${key}"`);
    return prototype.clone();
  }
}
