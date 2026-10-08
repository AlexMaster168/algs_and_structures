export interface Ticket {
  topic: string;
  severity: 1 | 2 | 3;
}

export abstract class SupportHandler {
  private next: SupportHandler | null = null;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler;
  }

  handle(ticket: Ticket): string {
    if (this.canHandle(ticket)) return this.resolve(ticket);
    if (this.next) return this.next.handle(ticket);
    return `Unresolved: ${ticket.topic}`;
  }

  protected abstract canHandle(ticket: Ticket): boolean;
  protected abstract resolve(ticket: Ticket): string;
}

export class FaqBot extends SupportHandler {
  private static readonly answers: Record<string, string> = {
    password: 'Use the "Forgot password" link',
    delivery: 'Delivery takes 3-5 days',
  };

  protected canHandle(ticket: Ticket): boolean {
    return ticket.severity === 1 && ticket.topic in FaqBot.answers;
  }

  protected resolve(ticket: Ticket): string {
    return `Bot: ${FaqBot.answers[ticket.topic]}`;
  }
}

export class SupportAgent extends SupportHandler {
  protected canHandle(ticket: Ticket): boolean {
    return ticket.severity <= 2;
  }

  protected resolve(ticket: Ticket): string {
    return `Agent resolved ${ticket.topic}`;
  }
}

export class Engineer extends SupportHandler {
  protected canHandle(): boolean {
    return true;
  }

  protected resolve(ticket: Ticket): string {
    return `Engineer fixed ${ticket.topic}`;
  }
}

export const createSupportChain = (): SupportHandler => {
  const bot = new FaqBot();
  bot.setNext(new SupportAgent()).setNext(new Engineer());
  return bot;
};
