import re
from dataclasses import dataclass


@dataclass(frozen=True)
class NumberExpression:
    value: float

    def interpret(self, context=None):
        return self.value

    def __str__(self):
        return f'{self.value:g}'


@dataclass(frozen=True)
class VariableExpression:
    name: str

    def interpret(self, context):
        return context[self.name]

    def __str__(self):
        return self.name


@dataclass(frozen=True)
class BinaryExpression:
    operator: str
    left: object
    right: object

    def interpret(self, context):
        a, b = self.left.interpret(context), self.right.interpret(context)
        return {'+': lambda: a + b, '-': lambda: a - b, '*': lambda: a * b, '/': lambda: a / b}[self.operator]()

    def __str__(self):
        return f'({self.left} {self.operator} {self.right})'


def parse_expression(source):
    tokens = re.findall(r'\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/()]', source)
    position = 0

    def peek():
        return tokens[position] if position < len(tokens) else None

    def consume():
        nonlocal position
        if position >= len(tokens):
            raise SyntaxError('Unexpected end')
        token = tokens[position]
        position += 1
        return token

    def primary():
        token = consume()
        if token == '(':
            inner = summation()
            if consume() != ')':
                raise SyntaxError('Expected )')
            return inner
        if token[0].isdigit():
            return NumberExpression(float(token))
        if token[0].isalpha() or token[0] == '_':
            return VariableExpression(token)
        raise SyntaxError(token)

    def product():
        result = primary()
        while peek() in ('*', '/'):
            result = BinaryExpression(consume(), result, primary())
        return result

    def summation():
        result = product()
        while peek() in ('+', '-'):
            result = BinaryExpression(consume(), result, product())
        return result

    result = summation()
    if position != len(tokens):
        raise SyntaxError('Unexpected token')
    return result
