export interface EditorSnapshot {
  readonly content: string;
  readonly cursor: number;
}

export class Editor {
  private content = '';
  private cursor = 0;

  get text(): string {
    return this.content;
  }

  get cursorPosition(): number {
    return this.cursor;
  }

  type(text: string): void {
    this.content = this.content.slice(0, this.cursor) + text + this.content.slice(this.cursor);
    this.cursor += text.length;
  }

  moveCursor(position: number): void {
    this.cursor = Math.max(0, Math.min(this.content.length, position));
  }

  save(): EditorSnapshot {
    return Object.freeze({ content: this.content, cursor: this.cursor });
  }

  restore(snapshot: EditorSnapshot): void {
    this.content = snapshot.content;
    this.cursor = snapshot.cursor;
  }
}

export class EditorHistory {
  private readonly snapshots: EditorSnapshot[] = [];

  constructor(private readonly editor: Editor) {}

  backup(): void {
    this.snapshots.push(this.editor.save());
  }

  undo(): boolean {
    const snapshot = this.snapshots.pop();
    if (!snapshot) return false;
    this.editor.restore(snapshot);
    return true;
  }
}
