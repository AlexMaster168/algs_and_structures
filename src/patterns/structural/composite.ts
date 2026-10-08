export interface FileSystemNode {
  readonly name: string;
  size(): number;
  render(indent?: string): string[];
}

export class FileEntry implements FileSystemNode {
  constructor(
    readonly name: string,
    private readonly bytes: number,
  ) {}

  size(): number {
    return this.bytes;
  }

  render(indent = ''): string[] {
    return [`${indent}${this.name} (${this.bytes})`];
  }
}

export class Directory implements FileSystemNode {
  private readonly children: FileSystemNode[] = [];

  constructor(readonly name: string) {}

  add(...nodes: FileSystemNode[]): this {
    this.children.push(...nodes);
    return this;
  }

  remove(name: string): boolean {
    const index = this.children.findIndex((child) => child.name === name);
    if (index === -1) return false;
    this.children.splice(index, 1);
    return true;
  }

  size(): number {
    return this.children.reduce((total, child) => total + child.size(), 0);
  }

  render(indent = ''): string[] {
    return [`${indent}${this.name}/ (${this.size()})`, ...this.children.flatMap((child) => child.render(`${indent}  `))];
  }
}
