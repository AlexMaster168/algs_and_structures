export class TextDocument {
  content = '';
}

export interface Command {
  execute(): void;
  undo(): void;
}

export class InsertCommand implements Command {
  constructor(
    private readonly document: TextDocument,
    private readonly position: number,
    private readonly text: string,
  ) {}

  execute(): void {
    const { content } = this.document;
    this.document.content = content.slice(0, this.position) + this.text + content.slice(this.position);
  }

  undo(): void {
    const { content } = this.document;
    this.document.content = content.slice(0, this.position) + content.slice(this.position + this.text.length);
  }
}

export class DeleteCommand implements Command {
  private removed = '';

  constructor(
    private readonly document: TextDocument,
    private readonly position: number,
    private readonly length: number,
  ) {}

  execute(): void {
    const { content } = this.document;
    this.removed = content.slice(this.position, this.position + this.length);
    this.document.content = content.slice(0, this.position) + content.slice(this.position + this.length);
  }

  undo(): void {
    const { content } = this.document;
    this.document.content = content.slice(0, this.position) + this.removed + content.slice(this.position);
  }
}

export class MacroCommand implements Command {
  constructor(private readonly commands: readonly Command[]) {}

  execute(): void {
    for (const command of this.commands) command.execute();
  }

  undo(): void {
    for (const command of [...this.commands].reverse()) command.undo();
  }
}

export class CommandHistory {
  private readonly done: Command[] = [];
  private readonly undone: Command[] = [];

  run(command: Command): void {
    command.execute();
    this.done.push(command);
    this.undone.length = 0;
  }

  undo(): boolean {
    const command = this.done.pop();
    if (!command) return false;
    command.undo();
    this.undone.push(command);
    return true;
  }

  redo(): boolean {
    const command = this.undone.pop();
    if (!command) return false;
    command.execute();
    this.done.push(command);
    return true;
  }
}
