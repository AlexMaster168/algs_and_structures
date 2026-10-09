import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const cases = JSON.parse(await readFile(new URL('../../golden-cases.json', import.meta.url), 'utf8'));
const normalize = value => JSON.parse(JSON.stringify(value, (_, item) =>
  typeof item === 'bigint' ? item.toString() : item instanceof Map ? [...item] : item));

for (const example of cases) {
  test(`${example.source}:${example.name}`, async () => {
    const path = example.source.replace(/^src\//, '../').replace(/\.ts$/, '.js');
    const library = await import(path);
    assert.deepEqual(normalize(library[example.name](...structuredClone(example.args))), example.expected);
  });
}
