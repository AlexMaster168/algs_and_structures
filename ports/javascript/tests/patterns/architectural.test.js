import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CircuitBreaker, CircuitOpenError, retry } from '../../patterns/architectural/circuit-breaker.js';
import { Container, token } from '../../patterns/architectural/dependency-injection.js';
import { TypedEventEmitter } from '../../patterns/architectural/event-emitter.js';
import { compose, Pipeline } from '../../patterns/architectural/middleware.js';
import { MemoryLogger, PaymentService } from '../../patterns/architectural/null-object.js';
import { InMemoryRepository } from '../../patterns/architectural/repository.js';
import { spec } from '../../patterns/architectural/specification.js';
import { combineReducers, counterReducer, createStore } from '../../patterns/architectural/store.js';
describe('Architectural patterns', () => {
    it('dependency injection container wires services', () => {
        class Database {
            config;
            constructor(config) {
                this.config = config;
            }
        }
        class UserService {
            db;
            constructor(db) {
                this.db = db;
            }
        }
        const CONFIG = token('config');
        const DB = token('db');
        const USERS = token('users');
        const container = new Container()
            .value(CONFIG, { url: 'postgres://localhost' })
            .register(DB, (c) => new Database(c.resolve(CONFIG)))
            .register(USERS, (c) => new UserService(c.resolve(DB)), 'transient');
        const a = container.resolve(USERS);
        const b = container.resolve(USERS);
        assert.notEqual(a, b);
        assert.equal(a.db, b.db);
        assert.equal(a.db.config.url, 'postgres://localhost');
        assert.throws(() => container.resolve(token('missing')), /No provider/);
        const A = token('a');
        const B = token('b');
        const cyclic = new Container().register(A, (c) => c.resolve(B)).register(B, (c) => c.resolve(A));
        assert.throws(() => cyclic.resolve(A), /Circular dependency/);
    });
    it('repository with specifications', async () => {
        const repository = new InMemoryRepository();
        await repository.save({ id: '1', name: 'Ann', age: 17, active: true });
        await repository.save({ id: '2', name: 'Bob', age: 30, active: false });
        await repository.save({ id: '3', name: 'Cid', age: 42, active: true });
        const adult = spec((user) => user.age >= 18);
        const active = spec((user) => user.active);
        assert.deepEqual((await repository.findAll(adult.and(active))).map((u) => u.name), ['Cid']);
        assert.deepEqual((await repository.findAll(adult.not().or(active.not()))).map((u) => u.name), ['Ann', 'Bob']);
        assert.equal((await repository.findAll()).length, 3);
        const found = (await repository.findById('1'));
        found.name = 'changed';
        assert.equal((await repository.findById('1')).name, 'Ann');
        assert.equal(await repository.delete('1'), true);
        assert.equal(await repository.findById('1'), null);
    });
    it('typed event emitter', () => {
        const emitter = new TypedEventEmitter();
        const events = [];
        const off = emitter.on('login', ({ user }) => events.push(`login:${user}`));
        emitter.once('logout', () => events.push('logout'));
        emitter.emit('login', { user: 'alex' });
        emitter.emit('logout', undefined);
        emitter.emit('logout', undefined);
        off();
        assert.equal(emitter.emit('login', { user: 'bob' }), 0);
        assert.deepEqual(events, ['login:alex', 'logout']);
        assert.equal(emitter.listenerCount('logout'), 0);
    });
    it('middleware pipeline runs in onion order', async () => {
        const order = [];
        const pipeline = new Pipeline()
            .use(async (_, next) => {
            order.push('logger:before');
            await next();
            order.push('logger:after');
        })
            .use((context, next) => {
            if (context.path !== '/admin')
                return next();
            context.status = 403;
        })
            .use((context) => {
            context.status = 200;
        });
        const ok = { path: '/' };
        await pipeline.run(ok);
        assert.equal(ok.status, 200);
        const denied = { path: '/admin', status: 0 };
        await pipeline.run(denied);
        assert.equal(denied.status, 403);
        assert.deepEqual(order, ['logger:before', 'logger:after', 'logger:before', 'logger:after']);
        const broken = compose([
            async (_, next) => {
                await next();
                await next();
            },
        ]);
        await assert.rejects(broken({}), /multiple times/);
    });
    it('null object removes null checks', () => {
        assert.equal(new PaymentService().charge(10), true);
        const logger = new MemoryLogger();
        const service = new PaymentService(logger);
        service.charge(10);
        service.charge(-1);
        assert.deepEqual(logger.lines, ['INFO charged 10', 'ERROR invalid amount -1']);
    });
    it('redux-like store', () => {
        const store = createStore(counterReducer, 0);
        const seen = [];
        const unsubscribe = store.subscribe(() => seen.push(store.getState()));
        store.dispatch({ type: 'increment' });
        store.dispatch({ type: 'add', amount: 10 });
        store.dispatch({ type: 'decrement' });
        unsubscribe();
        store.dispatch({ type: 'increment' });
        assert.deepEqual(seen, [1, 11, 10]);
        assert.equal(store.getState(), 11);
        const root = combineReducers({
            count: (state, action) => (action.type === 'rename' ? state : counterReducer(state, action)),
            name: (state, action) => (action.type === 'rename' ? action.name : state),
        });
        const app = createStore(root, { count: 0, name: 'app' });
        const before = app.getState();
        app.dispatch({ type: 'rename', name: 'shop' });
        assert.deepEqual(app.getState(), { count: 0, name: 'shop' });
        assert.notEqual(app.getState(), before);
    });
    it('circuit breaker opens and recovers', async () => {
        let now = 0;
        let healthy = false;
        const breaker = new CircuitBreaker(async (x) => {
            if (!healthy)
                throw new Error('down');
            return x * 2;
        }, { failureThreshold: 2, resetTimeoutMs: 100, now: () => now });
        await assert.rejects(breaker.call(1), /down/);
        await assert.rejects(breaker.call(1), /down/);
        assert.equal(breaker.state, 'open');
        await assert.rejects(breaker.call(1), CircuitOpenError);
        now = 150;
        assert.equal(breaker.state, 'half-open');
        await assert.rejects(breaker.call(1), /down/);
        assert.equal(breaker.state, 'open');
        now = 300;
        healthy = true;
        assert.equal(await breaker.call(21), 42);
        assert.equal(breaker.state, 'closed');
    });
    it('retry repeats failing actions', async () => {
        let attempts = 0;
        const result = await retry(async () => {
            if (++attempts < 3)
                throw new Error('flaky');
            return 'ok';
        });
        assert.equal(result, 'ok');
        assert.equal(attempts, 3);
        await assert.rejects(retry(async () => Promise.reject(new Error('always')), { attempts: 2, delayMs: 1 }), /always/);
    });
});
