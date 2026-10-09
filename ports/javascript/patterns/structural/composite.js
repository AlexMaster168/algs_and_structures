export class FileEntry {
    name;
    bytes;
    constructor(name, bytes) {
        this.name = name;
        this.bytes = bytes;
    }
    size() {
        return this.bytes;
    }
    render(indent = '') {
        return [`${indent}${this.name} (${this.bytes})`];
    }
}
export class Directory {
    name;
    children = [];
    constructor(name) {
        this.name = name;
    }
    add(...nodes) {
        this.children.push(...nodes);
        return this;
    }
    remove(name) {
        const index = this.children.findIndex((child) => child.name === name);
        if (index === -1)
            return false;
        this.children.splice(index, 1);
        return true;
    }
    size() {
        return this.children.reduce((total, child) => total + child.size(), 0);
    }
    render(indent = '') {
        return [`${indent}${this.name}/ (${this.size()})`, ...this.children.flatMap((child) => child.render(`${indent}  `))];
    }
}
