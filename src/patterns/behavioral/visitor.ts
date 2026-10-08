export interface ShapeVisitor<R> {
  visitCircle(circle: CircleShape): R;
  visitRectangle(rectangle: RectangleShape): R;
  visitTriangle(triangle: TriangleShape): R;
}

export interface VisitableShape {
  accept<R>(visitor: ShapeVisitor<R>): R;
}

export class CircleShape implements VisitableShape {
  constructor(readonly radius: number) {}

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitCircle(this);
  }
}

export class RectangleShape implements VisitableShape {
  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitRectangle(this);
  }
}

export class TriangleShape implements VisitableShape {
  constructor(
    readonly a: number,
    readonly b: number,
    readonly c: number,
  ) {}

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitTriangle(this);
  }
}

export class AreaVisitor implements ShapeVisitor<number> {
  visitCircle({ radius }: CircleShape): number {
    return Math.PI * radius ** 2;
  }

  visitRectangle({ width, height }: RectangleShape): number {
    return width * height;
  }

  visitTriangle({ a, b, c }: TriangleShape): number {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }
}

export class PerimeterVisitor implements ShapeVisitor<number> {
  visitCircle({ radius }: CircleShape): number {
    return 2 * Math.PI * radius;
  }

  visitRectangle({ width, height }: RectangleShape): number {
    return 2 * (width + height);
  }

  visitTriangle({ a, b, c }: TriangleShape): number {
    return a + b + c;
  }
}

export class JsonExportVisitor implements ShapeVisitor<string> {
  visitCircle({ radius }: CircleShape): string {
    return JSON.stringify({ type: 'circle', radius });
  }

  visitRectangle({ width, height }: RectangleShape): string {
    return JSON.stringify({ type: 'rectangle', width, height });
  }

  visitTriangle({ a, b, c }: TriangleShape): string {
    return JSON.stringify({ type: 'triangle', sides: [a, b, c] });
  }
}
