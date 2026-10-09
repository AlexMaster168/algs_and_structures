class MemoryLogger:
    def __init__(self):
        self.lines = []

    def info(self, message):
        self.lines.append(f'INFO {message}')

    def error(self, message):
        self.lines.append(f'ERROR {message}')


class NullLogger:
    def info(self, message):
        return None

    def error(self, message):
        return None


class PaymentService:
    def __init__(self, logger=None):
        self.logger = logger if logger is not None else NullLogger()

    def charge(self, amount):
        if amount <= 0:
            self.logger.error(f'invalid amount {amount}')
            return False
        self.logger.info(f'charged {amount}')
        return True
