from abc import ABC, abstractmethod


class SupportHandler(ABC):
    def __init__(self):
        self.next = None

    def set_next(self, handler):
        self.next = handler
        return handler

    def handle(self, ticket):
        if self.can_handle(ticket):
            return self.resolve(ticket)
        return self.next.handle(ticket) if self.next else f'Unresolved: {ticket["topic"]}'

    @abstractmethod
    def can_handle(self, ticket):
        raise NotImplementedError

    @abstractmethod
    def resolve(self, ticket):
        raise NotImplementedError


class FaqBot(SupportHandler):
    answers = {'password': 'Use the "Forgot password" link', 'delivery': 'Delivery takes 3-5 days'}

    def can_handle(self, ticket):
        return ticket['severity'] == 1 and ticket['topic'] in self.answers

    def resolve(self, ticket):
        return f'Bot: {self.answers[ticket["topic"]]}'


class SupportAgent(SupportHandler):
    def can_handle(self, ticket):
        return ticket['severity'] <= 2

    def resolve(self, ticket):
        return f'Agent resolved {ticket["topic"]}'


class Engineer(SupportHandler):
    def can_handle(self, ticket):
        return True

    def resolve(self, ticket):
        return f'Engineer fixed {ticket["topic"]}'


def create_support_chain():
    bot = FaqBot()
    bot.set_next(SupportAgent()).set_next(Engineer())
    return bot
