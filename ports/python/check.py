import asyncio
import importlib
import json
import pathlib
import random
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))


def native_name(name):
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', name)).lower()


def normalize(value):
    if isinstance(value, dict):
        return {native_name(key) if isinstance(key, str) else key: normalize(item) for key, item in value.items()}
    if isinstance(value, (tuple, list)):
        return [normalize(item) for item in value]
    return value


def check_modules():
    coverage = json.loads((ROOT / 'ports/python/coverage.json').read_text())
    sources = sorted((ROOT / 'src').rglob('*.ts'))
    assert len(coverage) == len(sources)
    for source in sources:
        entry = coverage[source.relative_to(ROOT).as_posix()]
        module = importlib.import_module(entry['path'][:-3].replace('/', '.'))
        exports = re.findall(r'^export\s+(?:abstract\s+)?(?:const|function\s*\*?|class)\s+(\w+)', source.read_text(), re.M)
        for name in exports:
            assert name in entry['exports'], (source, name)
            assert hasattr(module, entry['exports'][name]), (source, name)
    cases = json.loads((ROOT / 'ports/golden-cases.json').read_text())
    for case in cases:
        entry = coverage[case['source']]
        module = importlib.import_module(entry['path'][:-3].replace('/', '.'))
        actual = getattr(module, entry['exports'][case['name']])(*case['args'])
        expected = case['expected']
        if isinstance(expected, str) and isinstance(actual, int):
            actual = str(actual)
        if isinstance(expected, list) and isinstance(actual, dict):
            actual = list(actual.items())
        assert normalize(actual) == normalize(expected), (case['name'], actual, expected)
    return len(sources), len(cases)


def check_structures():
    from ports.python.data_structures.trees.avl_tree import AVLTree
    from ports.python.data_structures.trees.b_tree import BTree
    from ports.python.data_structures.trees.red_black_tree import RedBlackTree
    trees, expected, rng = [AVLTree(), BTree(), RedBlackTree()], set(), random.Random(168)
    for _ in range(2000):
        value = rng.randrange(300)
        insert = rng.random() < 0.55
        if insert:
            expected.add(value)
        else:
            expected.discard(value)
        for tree in trees:
            (tree.insert if insert else tree.delete)(value)
            assert tree.to_array() == sorted(expected)
        assert trees[-1].is_valid()


def check_patterns():
    from ports.python.patterns.behavioral.command import TextDocument, InsertCommand, CommandHistory
    from ports.python.patterns.behavioral.interpreter import parse_expression
    from ports.python.patterns.behavioral.state import Order
    document, history = TextDocument(), CommandHistory()
    history.run(InsertCommand(document, 0, 'abc'))
    history.run(InsertCommand(document, 1, 'X'))
    assert document.content == 'aXbc'
    assert history.undo() and document.content == 'abc'
    assert history.redo() and document.content == 'aXbc'
    assert parse_expression('2 + x * 3').interpret({'x': 4}) == 14
    order = Order()
    order.pay()
    order.ship()
    order.deliver()
    assert order.history == ['new', 'paid', 'shipped', 'delivered']


async def check_async():
    from ports.python.patterns.architectural.circuit_breaker import CircuitBreaker, CircuitOpenError, retry
    clock, attempts = [0], [0]
    async def action():
        attempts[0] += 1
        if attempts[0] <= 2:
            raise ValueError('Unavailable')
        return 42
    breaker = CircuitBreaker(action, failure_threshold=2, reset_timeout_ms=10, now=lambda: clock[0])
    for _ in range(2):
        try:
            await breaker.call()
        except ValueError:
            pass
        else:
            raise AssertionError('Failure expected')
    assert breaker.state == 'open'
    try:
        await breaker.call()
    except CircuitOpenError:
        pass
    else:
        raise AssertionError('Circuit should reject calls')
    clock[0] = 10
    assert breaker.state == 'half-open'
    assert await breaker.call() == 42 and breaker.state == 'closed'
    attempts[0] = 0
    assert await retry(action) == 42 and attempts[0] == 3


if __name__ == '__main__':
    modules, cases = check_modules()
    check_structures()
    check_patterns()
    asyncio.run(check_async())
    print(f'Python: {modules} modules, {cases} reference cases, 2000 tree operations and pattern checks passed')
