export class TextDocument {
    content = '';
}
export class InsertCommand {
    document;
    position;
    text;
    constructor(document, position, text) {
        this.document = document;
        this.position = position;
        this.text = text;
    }
    execute() {
        const { content } = this.document;
        this.document.content = content.slice(0, this.position) + this.text + content.slice(this.position);
    }
    undo() {
        const { content } = this.document;
        this.document.content = content.slice(0, this.position) + content.slice(this.position + this.text.length);
    }
}
export class DeleteCommand {
    document;
    position;
    length;
    removed = '';
    constructor(document, position, length) {
        this.document = document;
        this.position = position;
        this.length = length;
    }
    execute() {
        const { content } = this.document;
        this.removed = content.slice(this.position, this.position + this.length);
        this.document.content = content.slice(0, this.position) + content.slice(this.position + this.length);
    }
    undo() {
        const { content } = this.document;
        this.document.content = content.slice(0, this.position) + this.removed + content.slice(this.position);
    }
}
export class MacroCommand {
    commands;
    constructor(commands) {
        this.commands = commands;
    }
    execute() {
        for (const command of this.commands)
            command.execute();
    }
    undo() {
        for (const command of [...this.commands].reverse())
            command.undo();
    }
}
export class CommandHistory {
    done = [];
    undone = [];
    run(command) {
        command.execute();
        this.done.push(command);
        this.undone.length = 0;
    }
    undo() {
        const command = this.done.pop();
        if (!command)
            return false;
        command.undo();
        this.undone.push(command);
        return true;
    }
    redo() {
        const command = this.undone.pop();
        if (!command)
            return false;
        command.execute();
        this.done.push(command);
        return true;
    }
}
