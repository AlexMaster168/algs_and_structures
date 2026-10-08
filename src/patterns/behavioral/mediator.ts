export interface ChatMediator {
  join(user: ChatUser): void;
  send(from: ChatUser, message: string, to?: string): void;
}

export class ChatUser {
  readonly inbox: string[] = [];
  private room: ChatMediator | null = null;

  constructor(readonly name: string) {}

  attach(room: ChatMediator): void {
    this.room = room;
  }

  say(message: string, to?: string): void {
    if (!this.room) throw new Error(`${this.name} is not in a room`);
    this.room.send(this, message, to);
  }

  receive(from: string, message: string): void {
    this.inbox.push(`${from}: ${message}`);
  }
}

export class ChatRoom implements ChatMediator {
  private readonly users = new Map<string, ChatUser>();

  join(user: ChatUser): void {
    this.users.set(user.name, user);
    user.attach(this);
  }

  send(from: ChatUser, message: string, to?: string): void {
    if (to !== undefined) {
      this.users.get(to)?.receive(from.name, message);
      return;
    }
    for (const user of this.users.values()) {
      if (user !== from) user.receive(from.name, message);
    }
  }
}
