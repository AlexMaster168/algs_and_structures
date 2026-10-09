export class Editor {
    content = '';
    cursor = 0;
    get text() {
        return this.content;
    }
    get cursorPosition() {
        return this.cursor;
    }
    type(text) {
        this.content = this.content.slice(0, this.cursor) + text + this.content.slice(this.cursor);
        this.cursor += text.length;
    }
    moveCursor(position) {
        this.cursor = Math.max(0, Math.min(this.content.length, position));
    }
    save() {
        return Object.freeze({ content: this.content, cursor: this.cursor });
    }
    restore(snapshot) {
        this.content = snapshot.content;
        this.cursor = snapshot.cursor;
    }
}
export class EditorHistory {
    editor;
    snapshots = [];
    constructor(editor) {
        this.editor = editor;
    }
    backup() {
        this.snapshots.push(this.editor.save());
    }
    undo() {
        const snapshot = this.snapshots.pop();
        if (!snapshot)
            return false;
        this.editor.restore(snapshot);
        return true;
    }
}
