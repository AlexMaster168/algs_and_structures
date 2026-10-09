class ChatUser:
    def __init__(self, name):
        self.name, self.inbox, self.room = name, [], None

    def attach(self, room):
        self.room = room

    def say(self, message, to=None):
        if self.room is None:
            raise RuntimeError('User is not in a room')
        self.room.send(self, message, to)

    def receive(self, sender, message):
        self.inbox.append(f'{sender}: {message}')


class ChatRoom:
    def __init__(self):
        self.users = {}

    def join(self, user):
        self.users[user.name] = user
        user.attach(self)

    def send(self, sender, message, to=None):
        if to is not None:
            if to in self.users:
                self.users[to].receive(sender.name, message)
        else:
            for user in self.users.values():
                if user is not sender:
                    user.receive(sender.name, message)
