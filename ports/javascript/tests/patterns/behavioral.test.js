import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSupportChain } from '../../patterns/behavioral/chain-of-responsibility.js';
import { CommandHistory, DeleteCommand, InsertCommand, MacroCommand, TextDocument } from '../../patterns/behavioral/command.js';
import { parseExpression } from '../../patterns/behavioral/interpreter.js';
import { breadthFirst, depthFirst, NumberRange, take } from '../../patterns/behavioral/iterator.js';
import { ChatRoom, ChatUser } from '../../patterns/behavioral/mediator.js';
import { Editor, EditorHistory } from '../../patterns/behavioral/memento.js';
import { BehaviorSubject, StockTicker } from '../../patterns/behavioral/observer.js';
import { Order } from '../../patterns/behavioral/state.js';
import { FlatRateShipping, FreeOverThresholdShipping, ShippingCalculator, WeightBasedShipping, } from '../../patterns/behavioral/strategy.js';
import { CsvSalesMiner, JsonSalesMiner } from '../../patterns/behavioral/template-method.js';
import { AreaVisitor, CircleShape, JsonExportVisitor, PerimeterVisitor, RectangleShape, TriangleShape, } from '../../patterns/behavioral/visitor.js';
describe('Behavioral patterns', () => {
    it('chain of responsibility escalates tickets', () => {
        const chain = createSupportChain();
        assert.equal(chain.handle({ topic: 'password', severity: 1 }), 'Bot: Use the "Forgot password" link');
        assert.equal(chain.handle({ topic: 'refund', severity: 1 }), 'Agent resolved refund');
        assert.equal(chain.handle({ topic: 'outage', severity: 3 }), 'Engineer fixed outage');
    });
    it('command supports undo and redo', () => {
        const document = new TextDocument();
        const history = new CommandHistory();
        history.run(new InsertCommand(document, 0, 'Hello'));
        history.run(new InsertCommand(document, 5, ' world'));
        history.run(new DeleteCommand(document, 0, 6));
        assert.equal(document.content, 'world');
        history.undo();
        assert.equal(document.content, 'Hello world');
        history.undo();
        assert.equal(document.content, 'Hello');
        history.redo();
        assert.equal(document.content, 'Hello world');
        history.run(new MacroCommand([new InsertCommand(document, 0, '>> '), new InsertCommand(document, 14, '!')]));
        assert.equal(document.content, '>> Hello world!');
        history.undo();
        assert.equal(document.content, 'Hello world');
        assert.equal(history.redo(), true);
        assert.equal(history.redo(), false);
    });
    it('interpreter evaluates parsed expressions', () => {
        const expression = parseExpression('2 * (x + 3) - y / 2');
        assert.equal(expression.interpret({ x: 4, y: 10 }), 9);
        assert.equal(expression.toString(), '((2 * (x + 3)) - (y / 2))');
        assert.equal(parseExpression('1 + 2 * 3').interpret({}), 7);
        assert.throws(() => parseExpression('z').interpret({}), ReferenceError);
        assert.throws(() => parseExpression('(1 + 2'), SyntaxError);
        assert.throws(() => parseExpression('1 2'), SyntaxError);
    });
    it('iterators traverse collections', () => {
        assert.deepEqual([...new NumberRange(0, 10, 3)], [0, 3, 6, 9]);
        assert.deepEqual([...new NumberRange(5, 0, -2)], [5, 3, 1]);
        const iterator = new NumberRange(1, 3).createIterator();
        assert.equal(iterator.next(), 1);
        assert.equal(iterator.hasNext(), true);
        const tree = [{ value: 'a', children: [{ value: 'b', children: [{ value: 'd' }] }, { value: 'c' }] }];
        assert.deepEqual([...depthFirst(tree)], ['a', 'b', 'd', 'c']);
        assert.deepEqual([...breadthFirst(tree)], ['a', 'b', 'c', 'd']);
        function* naturals() {
            for (let n = 1;; n++)
                yield n;
        }
        assert.deepEqual([...take(naturals(), 3)], [1, 2, 3]);
    });
    it('mediator routes messages', () => {
        const room = new ChatRoom();
        const [alice, bob, carol] = ['alice', 'bob', 'carol'].map((name) => new ChatUser(name));
        [alice, bob, carol].forEach((user) => room.join(user));
        alice.say('hi all');
        bob.say('psst', 'carol');
        assert.deepEqual(alice.inbox, []);
        assert.deepEqual(bob.inbox, ['alice: hi all']);
        assert.deepEqual(carol.inbox, ['alice: hi all', 'bob: psst']);
        assert.throws(() => new ChatUser('dave').say('hello'));
    });
    it('memento restores previous states', () => {
        const editor = new Editor();
        const history = new EditorHistory(editor);
        editor.type('Hello');
        history.backup();
        editor.moveCursor(0);
        editor.type('Oh, ');
        assert.equal(editor.text, 'Oh, Hello');
        assert.equal(history.undo(), true);
        assert.equal(editor.text, 'Hello');
        assert.equal(editor.cursorPosition, 5);
        assert.equal(history.undo(), false);
    });
    it('observer notifies subscribers', () => {
        const ticker = new StockTicker();
        const received = [];
        const unsubscribe = ticker.changes.subscribe((change) => received.push(change));
        ticker.update('AAPL', 100);
        ticker.update('AAPL', 105);
        unsubscribe();
        ticker.update('AAPL', 90);
        assert.deepEqual(received, [
            { symbol: 'AAPL', price: 100, change: 0 },
            { symbol: 'AAPL', price: 105, change: 5 },
        ]);
        assert.equal(ticker.changes.observerCount, 0);
        const theme = new BehaviorSubject('light');
        const seen = [];
        theme.subscribe((value) => seen.push(value));
        theme.notify('dark');
        assert.deepEqual(seen, ['light', 'dark']);
        assert.equal(theme.value, 'dark');
    });
    it('state controls allowed transitions', () => {
        const order = new Order();
        order.pay();
        order.ship();
        assert.throws(() => order.cancel(), /Cannot cancel an order in state "shipped"/);
        order.deliver();
        assert.equal(order.status, 'delivered');
        assert.deepEqual(order.history, ['new', 'paid', 'shipped', 'delivered']);
        const cancelled = new Order();
        cancelled.cancel();
        assert.throws(() => cancelled.pay());
        assert.equal(cancelled.status, 'cancelled');
    });
    it('strategy swaps algorithms at runtime', () => {
        const parcel = { weightKg: 2.3, orderTotal: 80 };
        const flat = new FlatRateShipping(10);
        const weight = new WeightBasedShipping(4);
        const free = new FreeOverThresholdShipping(50, flat);
        const calculator = new ShippingCalculator(flat);
        assert.equal(calculator.calculate(parcel), 10);
        calculator.setStrategy(weight);
        assert.equal(calculator.calculate(parcel), 12);
        assert.equal(calculator.cheapest(parcel, [flat, weight, free]).name, 'free-over-threshold');
        assert.equal(free.cost({ weightKg: 1, orderTotal: 10 }), 10);
    });
    it('template method fixes the algorithm skeleton', () => {
        const csv = 'product,amount\napple,10\npear,5\napple,7\nbroken,abc';
        assert.deepEqual(new CsvSalesMiner().mine(csv), { total: 22, topProduct: 'apple', records: 3 });
        const json = JSON.stringify([
            { product: 'tea', amount: 3 },
            { product: 'coffee', amount: 8 },
            { product: '', amount: 100 },
        ]);
        assert.deepEqual(new JsonSalesMiner().mine(json), { total: 11, topProduct: 'coffee', records: 2 });
    });
    it('visitor adds operations without changing shapes', () => {
        const shapes = [new CircleShape(1), new RectangleShape(2, 3), new TriangleShape(3, 4, 5)];
        const areas = shapes.map((shape) => shape.accept(new AreaVisitor()));
        assert.ok(Math.abs(areas[0] - Math.PI) < 1e-12);
        assert.deepEqual(areas.slice(1), [6, 6]);
        assert.deepEqual(shapes.slice(1).map((shape) => shape.accept(new PerimeterVisitor())), [10, 12]);
        assert.equal(shapes[2].accept(new JsonExportVisitor()), '{"type":"triangle","sides":[3,4,5]}');
    });
});
