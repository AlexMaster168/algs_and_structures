export type Context = Readonly<Record<string, number>>;

export interface Expression {
  interpret(context: Context): number;
  toString(): string;
}

export class NumberExpression implements Expression {
  constructor(private readonly value: number) {}

  interpret(): number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }
}

export class VariableExpression implements Expression {
  constructor(private readonly name: string) {}

  interpret(context: Context): number {
    const value = context[this.name];
    if (value === undefined) throw new ReferenceError(`Variable "${this.name}" is not defined`);
    return value;
  }

  toString(): string {
    return this.name;
  }
}

const operations = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
};

type Operator = keyof typeof operations;

export class BinaryExpression implements Expression {
  constructor(
    private readonly operator: Operator,
    private readonly left: Expression,
    private readonly right: Expression,
  ) {}

  interpret(context: Context): number {
    return operations[this.operator](this.left.interpret(context), this.right.interpret(context));
  }

  toString(): string {
    return `(${this.left} ${this.operator} ${this.right})`;
  }
}

export const parseExpression = (source: string): Expression => {
  const tokens = source.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/()]/g) ?? [];
  let position = 0;

  const peek = (): string | undefined => tokens[position];
  const consume = (): string => {
    const token = tokens[position++];
    if (token === undefined) throw new SyntaxError('Unexpected end of expression');
    return token;
  };

  const parsePrimary = (): Expression => {
    const token = consume();
    if (token === '(') {
      const inner = parseSum();
      if (consume() !== ')') throw new SyntaxError('Expected ")"');
      return inner;
    }
    if (/^\d/.test(token)) return new NumberExpression(Number(token));
    if (/^[A-Za-z_]/.test(token)) return new VariableExpression(token);
    throw new SyntaxError(`Unexpected token "${token}"`);
  };

  const parseProduct = (): Expression => {
    let expression = parsePrimary();
    while (peek() === '*' || peek() === '/') {
      const operator = consume() as Operator;
      expression = new BinaryExpression(operator, expression, parsePrimary());
    }
    return expression;
  };

  const parseSum = (): Expression => {
    let expression = parseProduct();
    while (peek() === '+' || peek() === '-') {
      const operator = consume() as Operator;
      expression = new BinaryExpression(operator, expression, parseProduct());
    }
    return expression;
  };

  const result = parseSum();
  if (position !== tokens.length) throw new SyntaxError(`Unexpected token "${peek()}"`);
  return result;
};
