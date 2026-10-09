export class ChatUser {
    name;
    inbox = [];
    room = null;
    constructor(name) {
        this.name = name;
    }
    attach(room) {
        this.room = room;
    }
    say(message, to) {
        if (!this.room)
            throw new Error(`${this.name} is not in a room`);
        this.room.send(this, message, to);
    }
    receive(from, message) {
        this.inbox.push(`${from}: ${message}`);
    }
}
export class ChatRoom {
    users = new Map();
    join(user) {
        this.users.set(user.name, user);
        user.attach(this);
    }
    send(from, message, to) {
        if (to !== undefined) {
            this.users.get(to)?.receive(from.name, message);
            return;
        }
        for (const user of this.users.values()) {
            if (user !== from)
                user.receive(from.name, message);
        }
    }
}
