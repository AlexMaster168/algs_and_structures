export class EmailNotifier {
    email;
    constructor(email) {
        this.email = email;
    }
    send(message) {
        return [`email to ${this.email}: ${message}`];
    }
}
export class NotifierDecorator {
    wrapped;
    constructor(wrapped) {
        this.wrapped = wrapped;
    }
    send(message) {
        return this.wrapped.send(message);
    }
}
export class SmsNotifier extends NotifierDecorator {
    phone;
    constructor(wrapped, phone) {
        super(wrapped);
        this.phone = phone;
    }
    send(message) {
        return [...super.send(message), `sms to ${this.phone}: ${message}`];
    }
}
export class SlackNotifier extends NotifierDecorator {
    channel;
    constructor(wrapped, channel) {
        super(wrapped);
        this.channel = channel;
    }
    send(message) {
        return [...super.send(message), `slack #${this.channel}: ${message}`];
    }
}
export const withLogging = (fn, log, name = fn.name || 'anonymous') => (...args) => {
    log(`${name}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`);
    const result = fn(...args);
    log(`${name} -> ${JSON.stringify(result)}`);
    return result;
};
