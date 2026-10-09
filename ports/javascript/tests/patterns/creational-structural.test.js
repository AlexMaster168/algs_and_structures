import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DarkThemeFactory, LightThemeFactory, renderSettingsForm } from '../../patterns/creational/abstract-factory.js';
import { HttpRequestBuilder } from '../../patterns/creational/builder.js';
import { createTransport, RoadLogistics, SeaLogistics } from '../../patterns/creational/factory-method.js';
import { ObjectPool } from '../../patterns/creational/object-pool.js';
import { Circle, PrototypeRegistry, Rectangle } from '../../patterns/creational/prototype.js';
import { AppConfig, lazySingleton } from '../../patterns/creational/singleton.js';
import { averageTemperature, FahrenheitSensorAdapter, LegacyFahrenheitSensor, promisify } from '../../patterns/structural/adapter.js';
import { AdvancedRemoteControl, Radio, RemoteControl, Tv } from '../../patterns/structural/bridge.js';
import { Directory, FileEntry } from '../../patterns/structural/composite.js';
import { EmailNotifier, SlackNotifier, SmsNotifier, withLogging } from '../../patterns/structural/decorator.js';
import { VideoConverter } from '../../patterns/structural/facade.js';
import { Forest } from '../../patterns/structural/flyweight.js';
import { AccessControlProxy, CachingWeatherProxy, createValidatedObject } from '../../patterns/structural/proxy.js';
describe('Creational patterns', () => {
    it('singleton returns one shared instance', () => {
        AppConfig.getInstance().set('env', 'test');
        assert.equal(AppConfig.getInstance(), AppConfig.getInstance());
        assert.equal(AppConfig.getInstance().get('env'), 'test');
        assert.equal(AppConfig.getInstance().get('missing', 'default'), 'default');
        let created = 0;
        const getConnection = lazySingleton(() => ({ id: ++created }));
        assert.equal(created, 0);
        assert.equal(getConnection(), getConnection());
        assert.equal(created, 1);
    });
    it('factory method lets subclasses choose the product', () => {
        assert.equal(new RoadLogistics().planDelivery('apples'), 'Truck delivers apples by road');
        assert.equal(new SeaLogistics().planDelivery('oil'), 'Ship delivers oil by sea');
        assert.equal(createTransport('ship').kind, 'ship');
    });
    it('abstract factory produces consistent families', () => {
        assert.deepEqual(renderSettingsForm(new LightThemeFactory()), ['[light x]', '[light button: Save]']);
        assert.deepEqual(renderSettingsForm(new DarkThemeFactory()), ['[dark x]', '[dark button: Save]']);
    });
    it('builder assembles immutable requests step by step', () => {
        const request = HttpRequestBuilder.post('https://api.example.com/users')
            .param('notify', 1)
            .header('Authorization', 'Bearer token')
            .json({ name: 'Alex' })
            .timeout(5000)
            .build();
        assert.deepEqual(request, {
            method: 'POST',
            url: 'https://api.example.com/users?notify=1',
            headers: { authorization: 'Bearer token', 'content-type': 'application/json' },
            timeoutMs: 5000,
            body: '{"name":"Alex"}',
        });
        assert.ok(Object.isFrozen(request));
        assert.throws(() => new HttpRequestBuilder().build(), /URL is required/);
        assert.throws(() => HttpRequestBuilder.get('/x').json({}).build(), /cannot have a body/);
    });
    it('prototype clones deeply', () => {
        const original = new Circle(0, 0, 'red', 2, ['round']);
        const copy = original.clone();
        copy.tags.push('copy');
        copy.x = 10;
        assert.deepEqual(original.tags, ['round']);
        assert.equal(original.x, 0);
        assert.ok(copy instanceof Circle);
        const registry = new PrototypeRegistry().register('square', new Rectangle(0, 0, 'blue', 3, 3));
        const a = registry.create('square');
        const b = registry.create('square');
        assert.notEqual(a, b);
        assert.equal(a.area(), 9);
        assert.throws(() => registry.create('unknown'));
    });
    it('object pool reuses instances', () => {
        let created = 0;
        const pool = new ObjectPool(() => ({ id: ++created, data: [] }), (item) => (item.data.length = 0), 2);
        const first = pool.acquire();
        first.data.push(1);
        pool.release(first);
        const again = pool.acquire();
        assert.equal(again, first);
        assert.deepEqual(again.data, []);
        pool.acquire();
        assert.throws(() => pool.acquire(), /exhausted/);
        assert.equal(pool.inUseCount, 2);
        assert.throws(() => pool.release({ id: 99, data: [] }));
        pool.release(again);
        assert.equal(pool.use((item) => item.id), 1);
        assert.equal(created, 2);
    });
});
describe('Structural patterns', () => {
    it('adapter makes legacy sensors compatible', () => {
        const sensors = [new FahrenheitSensorAdapter(new LegacyFahrenheitSensor(212)), { celsius: () => 0 }];
        assert.equal(sensors[0].celsius(), 100);
        assert.equal(averageTemperature(sensors), 50);
    });
    it('adapter converts callbacks to promises', async () => {
        const legacy = (a, b, callback) => b === 0 ? callback(new Error('division by zero')) : callback(null, a / b);
        const divide = promisify(legacy);
        assert.equal(await divide(10, 2), 5);
        await assert.rejects(divide(1, 0), /division by zero/);
    });
    it('bridge separates remotes from devices', () => {
        const tv = new Tv();
        const remote = new RemoteControl(tv);
        remote.togglePower();
        remote.volumeUp();
        assert.equal(tv.isEnabled(), true);
        assert.equal(tv.getVolume(), 40);
        const radio = new Radio();
        const advanced = new AdvancedRemoteControl(radio);
        advanced.volumeUp(100);
        assert.equal(radio.getVolume(), 100);
        advanced.mute();
        assert.equal(radio.getVolume(), 0);
    });
    it('composite treats files and folders uniformly', () => {
        const root = new Directory('root').add(new FileEntry('a.txt', 100), new Directory('src').add(new FileEntry('index.ts', 250), new FileEntry('util.ts', 50)));
        assert.equal(root.size(), 400);
        assert.deepEqual(root.render(), ['root/ (400)', '  a.txt (100)', '  src/ (300)', '    index.ts (250)', '    util.ts (50)']);
        assert.equal(root.remove('a.txt'), true);
        assert.equal(root.size(), 300);
    });
    it('decorator stacks behaviour', () => {
        const notifier = new SlackNotifier(new SmsNotifier(new EmailNotifier('a@b.c'), '+100'), 'alerts');
        assert.deepEqual(notifier.send('down'), ['email to a@b.c: down', 'sms to +100: down', 'slack #alerts: down']);
        const lines = [];
        const add = withLogging((a, b) => a + b, (line) => lines.push(line), 'add');
        assert.equal(add(2, 3), 5);
        assert.deepEqual(lines, ['add(2, 3)', 'add -> 5']);
    });
    it('facade hides the subsystem', () => {
        assert.equal(new VideoConverter().convert('movie.ogg', 'mp4'), 'buffer(movie.ogg, ogg-codec) -> mp4 + normalized audio');
    });
    it('flyweight shares intrinsic state', () => {
        const forest = new Forest();
        for (let i = 0; i < 1000; i++)
            forest.plant(i, i * 2, i % 2 ? 'oak' : 'pine', 'green', 'bark.png');
        assert.equal(forest.treeCount, 1000);
        assert.equal(forest.typeCount, 2);
        assert.equal(forest.draw()[1], 'oak(green) at 1,2');
    });
    it('proxy caches and guards access', async () => {
        let calls = 0;
        let now = 0;
        const service = { temperature: async () => ++calls };
        const proxy = new CachingWeatherProxy(service, 1000, () => now);
        assert.equal(await proxy.temperature('Kyiv'), 1);
        assert.equal(await proxy.temperature('Kyiv'), 1);
        now = 1500;
        assert.equal(await proxy.temperature('Kyiv'), 2);
        let allowed = false;
        const guarded = new AccessControlProxy(service, () => allowed);
        await assert.rejects(guarded.temperature('Lviv'), /Access denied/);
        allowed = true;
        assert.equal(await guarded.temperature('Lviv'), 3);
        const user = createValidatedObject({ age: 20 }, (key, value) => key !== 'age' || (typeof value === 'number' && value >= 0));
        user.age = 30;
        assert.equal(user.age, 30);
        assert.throws(() => (user.age = -1), TypeError);
    });
});
