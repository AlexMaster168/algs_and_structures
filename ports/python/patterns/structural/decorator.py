import json


class EmailNotifier:
    def __init__(self, email):
        self.email = email

    def send(self, message):
        return [f'email to {self.email}: {message}']


class NotifierDecorator:
    def __init__(self, wrapped):
        self.wrapped = wrapped

    def send(self, message):
        return self.wrapped.send(message)


class SmsNotifier(NotifierDecorator):
    def __init__(self, wrapped, phone):
        super().__init__(wrapped)
        self.phone = phone

    def send(self, message):
        return super().send(message) + [f'sms to {self.phone}: {message}']


class SlackNotifier(NotifierDecorator):
    def __init__(self, wrapped, channel):
        super().__init__(wrapped)
        self.channel = channel

    def send(self, message):
        return super().send(message) + [f'slack #{self.channel}: {message}']


def with_logging(function, log, name=None):
    name = name or function.__name__ or 'anonymous'
    encode = lambda value: json.dumps(value, separators=(',', ':'), ensure_ascii=False)

    def call(*args):
        log(f'{name}({", ".join(encode(arg) for arg in args)})')
        result = function(*args)
        log(f'{name} -> {encode(result)}')
        return result
    return call
