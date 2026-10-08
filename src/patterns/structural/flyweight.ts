export class TreeType {
  constructor(
    readonly name: string,
    readonly color: string,
    readonly texture: string,
  ) {}

  draw(x: number, y: number): string {
    return `${this.name}(${this.color}) at ${x},${y}`;
  }
}

export class TreeTypeFactory {
  private readonly types = new Map<string, TreeType>();

  get count(): number {
    return this.types.size;
  }

  get(name: string, color: string, texture: string): TreeType {
    const key = `${name}|${color}|${texture}`;
    let type = this.types.get(key);
    if (!type) {
      type = new TreeType(name, color, texture);
      this.types.set(key, type);
    }
    return type;
  }
}

interface Tree {
  x: number;
  y: number;
  type: TreeType;
}

export class Forest {
  private readonly trees: Tree[] = [];

  constructor(private readonly factory = new TreeTypeFactory()) {}

  get treeCount(): number {
    return this.trees.length;
  }

  get typeCount(): number {
    return this.factory.count;
  }

  plant(x: number, y: number, name: string, color: string, texture: string): this {
    this.trees.push({ x, y, type: this.factory.get(name, color, texture) });
    return this;
  }

  draw(): string[] {
    return this.trees.map(({ x, y, type }) => type.draw(x, y));
  }
}
