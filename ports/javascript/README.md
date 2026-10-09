# JavaScript

Полная коллекция из 140 модулей: алгоритмы, структуры данных, паттерны и общие функции сравнения. Структура каталогов и имена экспортов совпадают с TypeScript. Файлы работают как самостоятельные ES-модули и не требуют компилятора TypeScript.

## Использование

Выполните из каталога `ports/javascript`:

```javascript
import { mergeSort } from './algorithms/sorting/merge-sort.js';
import { dijkstra } from './algorithms/graphs/dijkstra.js';
import { RedBlackTree } from './data-structures/trees/red-black-tree.js';
import { fibonacciFast } from './algorithms/dynamic-programming/fibonacci.js';

console.log(mergeSort([3, 1, 2]));
console.log(dijkstra([
  [{ to: 1, weight: 2 }, { to: 2, weight: 8 }],
  [{ to: 2, weight: 3 }],
  [],
], 0).distance);
const tree = new RedBlackTree();
tree.insert(3);
tree.insert(1);
tree.insert(2);
tree.delete(3);
console.log(tree.toArray());
console.log(fibonacciFast(100).toString());
```

Результаты: `[1, 2, 3]`, `[0, 2, 5]`, `[1, 2]`, `354224848179261915075`.

## Проверка

Из корня репозитория:

```bash
node --test "ports/javascript/tests/**/*.test.js"
```

218 проверок включают исходные 154 теста и 64 общих эталонных примера: случайные операции на деревьях, хеш-таблицах и структурах запросов на отрезках, сравнение с эталонными вычислениями и поведение паттернов. Нужен Node.js 22 или новее.

## Особенности

Обычные численные алгоритмы используют `Number`; для точных целых чисел вне безопасного диапазона служит `BigInt`. Фибоначчи, факториал и модульное возведение в степень сохраняют эту точность. Индексы строковых алгоритмов соответствуют UTF-16. Асинхронные паттерны используют `Promise` и `async`/`await`.

Описание идей, сложностей и условий применения находится в [основном README](../../README.md), соответствие модулей — в [каталоге](../CATALOG.md).
