export class NumberExpression {
    value;
    constructor(value) {
        this.value = value;
    }
    interpret() {
        return this.value;
    }
    toString() {
        return String(this.value);
    }
}
export class VariableExpression {
    name;
    constructor(name) {
        this.name = name;
    }
    interpret(context) {
        const value = context[this.name];
        if (value === undefined)
            throw new ReferenceError(`Variable "${this.name}" is not defined`);
        return value;
    }
    toString() {
        return this.name;
    }
}
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};
export class BinaryExpression {
    operator;
    left;
    right;
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    interpret(context) {
        return operations[this.operator](this.left.interpret(context), this.right.interpret(context));
    }
    toString() {
        return `(${this.left} ${this.operator} ${this.right})`;
    }
}
export const parseExpression = (source) => {
    const tokens = source.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/()]/g) ?? [];
    let position = 0;
    const peek = () => tokens[position];
    const consume = () => {
        const token = tokens[position++];
        if (token === undefined)
            throw new SyntaxError('Unexpected end of expression');
        return token;
    };
    const parsePrimary = () => {
        const token = consume();
        if (token === '(') {
            const inner = parseSum();
            if (consume() !== ')')
                throw new SyntaxError('Expected ")"');
            return inner;
        }
        if (/^\d/.test(token))
            return new NumberExpression(Number(token));
        if (/^[A-Za-z_]/.test(token))
            return new VariableExpression(token);
        throw new SyntaxError(`Unexpected token "${token}"`);
    };
    const parseProduct = () => {
        let expression = parsePrimary();
        while (peek() === '*' || peek() === '/') {
            const operator = consume();
            expression = new BinaryExpression(operator, expression, parsePrimary());
        }
        return expression;
    };
    const parseSum = () => {
        let expression = parseProduct();
        while (peek() === '+' || peek() === '-') {
            const operator = consume();
            expression = new BinaryExpression(operator, expression, parseProduct());
        }
        return expression;
    };
    const result = parseSum();
    if (position !== tokens.length)
        throw new SyntaxError(`Unexpected token "${peek()}"`);
    return result;
};
