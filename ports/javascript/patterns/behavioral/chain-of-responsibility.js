export class SupportHandler {
    next = null;
    setNext(handler) {
        this.next = handler;
        return handler;
    }
    handle(ticket) {
        if (this.canHandle(ticket))
            return this.resolve(ticket);
        if (this.next)
            return this.next.handle(ticket);
        return `Unresolved: ${ticket.topic}`;
    }
}
export class FaqBot extends SupportHandler {
    static answers = {
        password: 'Use the "Forgot password" link',
        delivery: 'Delivery takes 3-5 days',
    };
    canHandle(ticket) {
        return ticket.severity === 1 && ticket.topic in FaqBot.answers;
    }
    resolve(ticket) {
        return `Bot: ${FaqBot.answers[ticket.topic]}`;
    }
}
export class SupportAgent extends SupportHandler {
    canHandle(ticket) {
        return ticket.severity <= 2;
    }
    resolve(ticket) {
        return `Agent resolved ${ticket.topic}`;
    }
}
export class Engineer extends SupportHandler {
    canHandle() {
        return true;
    }
    resolve(ticket) {
        return `Engineer fixed ${ticket.topic}`;
    }
}
export const createSupportChain = () => {
    const bot = new FaqBot();
    bot.setNext(new SupportAgent()).setNext(new Engineer());
    return bot;
};
