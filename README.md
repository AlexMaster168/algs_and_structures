# Algorithms, Data Structures & Design Patterns

[![CI](https://github.com/AlexMaster168/algs_and_structures/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexMaster168/algs_and_structures/actions/workflows/ci.yml)

Коллекция алгоритмов, структур данных и паттернов проектирования на TypeScript 7 (strict, ESM). Каждая реализация покрыта тестами на `node:test`.

## Запуск

Требуется Node.js 22+ и pnpm 12.

```bash
pnpm install
pnpm test        # сборка + все тесты
pnpm typecheck   # только проверка типов
pnpm build       # компиляция в dist/
```

CI в GitHub Actions прогоняет `typecheck` и `test` на Node 22 и 24 при каждом пуше в `master` и в каждом pull request.

## Структура

```
src/
  shared/                 общие типы (Comparator)
  data-structures/
    linear/               списки, стек, очередь, дек, кольцевой буфер, skip list
    heaps/                бинарная куча, очередь с приоритетом
    hashing/              хеш-таблицы, Bloom filter, LRU-кеш
    trees/                BST, AVL, красно-чёрное дерево, B-дерево, Trie
    range-queries/        дерево отрезков, Fenwick, sparse table, sqrt-декомпозиция
    graphs/               граф, система непересекающихся множеств
  algorithms/
    sorting/              12 сортировок
    searching/            бинарный, экспоненциальный, интерполяционный поиск и др.
    graphs/               обходы, кратчайшие пути, остовы, SCC, потоки
    trees/                обходы бинарных деревьев, LCA, диаметр
    dynamic-programming/  рюкзак, LCS, LIS, расстояние Левенштейна и др.
    strings/              KMP, Z-функция, Рабин-Карп, Ахо-Корасик, суффиксный массив
    math/                 НОД, простые числа, матрицы, комбинаторика
    backtracking/         перестановки, N ферзей, судоку
    greedy/               интервалы, код Хаффмана, дробный рюкзак
    techniques/           два указателя, скользящее окно, префиксные суммы
    randomized/           Фишер-Йетс, reservoir sampling, Монте-Карло
    bit-manipulation/     битовые трюки
    geometry/             выпуклая оболочка, пересечение отрезков, ближайшая пара
  patterns/
    creational/           порождающие
    structural/           структурные
    behavioral/           поведенческие
    architectural/        архитектурные и прикладные
tests/                    тесты, повторяющие структуру src/
```

Все функции и классы с компаратором принимают `Comparator<T> = (a, b) => number`. По умолчанию это естественный порядок `<`/`>`. Сортировки не мутируют входной массив.

Импорты в примерах указаны относительно корня репозитория.

---

# Структуры данных

## Линейные

### Односвязный список — `LinkedList`

Узлы хранят значение и ссылку на следующий. Вставка в начало и конец O(1), доступ по индексу O(n).

```ts
import { LinkedList } from './src/data-structures/linear/linked-list.js';

const list = LinkedList.from(['My', 'name']).prepend('Hi').append('Slim').insertAt(3, 'is');
list.toArray();     // ['Hi', 'My', 'name', 'is', 'Slim']
list.indexOf('is'); // 3
list.remove('Hi');  // true
list.reverse().toArray(); // ['Slim', 'is', 'name', 'My']
```

### Двусвязный список — `DoublyLinkedList`

Ссылки в обе стороны: O(1) вставка и удаление с обоих концов и удаление известного узла. На нём построен `LRUCache`.

```ts
import { DoublyLinkedList } from './src/data-structures/linear/doubly-linked-list.js';

const list = DoublyLinkedList.from([2, 3]);
list.pushFront(1);
list.pushBack(4);
[...list.reversed()]; // [4, 3, 2, 1]
list.popFront();      // 1
```

### Стек — `Stack`

LIFO: последним пришёл, первым ушёл. Все операции O(1).

```ts
import { Stack } from './src/data-structures/linear/stack.js';

const stack = new Stack<number>().push(1).push(2).push(3);
stack.peek(); // 3
stack.pop();  // 3
```

### Очередь — `Queue`

FIFO на массиве с указателем головы и периодическим сжатием. `dequeue` амортизированно O(1), в отличие от `Array.shift()` за O(n).

```ts
import { Queue } from './src/data-structures/linear/queue.js';

const queue = new Queue<string>().enqueue('a').enqueue('b');
queue.dequeue(); // 'a'
queue.peek();    // 'b'
```

### Дек — `Deque`

Двусторонняя очередь на растущем кольцевом буфере: O(1) на обоих концах и O(1) доступ по индексу.

```ts
import { Deque } from './src/data-structures/linear/deque.js';

const deque = new Deque<number>();
deque.pushBack(1).pushFront(0).pushBack(2);
deque.at(-1);     // 2
deque.popFront(); // 0
```

### Кольцевой буфер — `CircularBuffer`

Фиксированная ёмкость. При переполнении затирается самое старое значение. Подходит для логов, метрик и «последних N событий».

```ts
import { CircularBuffer } from './src/data-structures/linear/circular-buffer.js';

const buffer = new CircularBuffer<number>(3);
[1, 2, 3].forEach((n) => buffer.push(n));
buffer.push(4);   // вернёт вытесненную 1
buffer.toArray(); // [2, 3, 4]
```

### Список с пропусками — `SkipList`

Отсортированное множество на нескольких уровнях связных списков со случайной высотой узлов. Поиск, вставка и удаление в среднем O(log n), без балансировок.

```ts
import { SkipList } from './src/data-structures/linear/skip-list.js';

const set = new SkipList<number>();
[5, 1, 9, 3].forEach((n) => set.insert(n));
set.has(9);    // true
set.delete(1);
set.toArray(); // [3, 5, 9]
```

## Кучи

### Бинарная куча — `BinaryHeap`, `MinHeap`, `MaxHeap`

Полное двоичное дерево в массиве: родитель не больше потомков (для min-кучи). `push`/`pop` O(log n), `peek` O(1), построение из массива O(n).

```ts
import { BinaryHeap, MaxHeap, MinHeap } from './src/data-structures/heaps/binary-heap.js';

const min = new MinHeap([5, 3, 8, 1]);
min.pop(); // 1

new MaxHeap([3, 1, 4, 1, 5]).toSortedArray(); // [5, 4, 3, 1, 1]

const byLength = new BinaryHeap<string>((a, b) => a.length - b.length).push('ccc', 'a', 'bb');
byLength.pop(); // 'a'
```

### Очередь с приоритетом — `PriorityQueue`

Обёртка над кучей: меньшее число означает более высокий приоритет. При равном приоритете порядок вставки сохраняется (стабильность).

```ts
import { PriorityQueue } from './src/data-structures/heaps/priority-queue.js';

const tasks = new PriorityQueue<string>().enqueue('low', 5).enqueue('urgent', 1).enqueue('urgent-2', 1);
tasks.dequeue(); // 'urgent'
tasks.dequeue(); // 'urgent-2'
```

## Хеширование

### Хеш-таблица с цепочками — `HashTable`

Массив корзин, коллизии складываются в список. Хеш FNV-1a, расширение вдвое при load factor > 0.75. Операции в среднем O(1).

```ts
import { HashTable } from './src/data-structures/hashing/hash-table.js';

const table = new HashTable<string | number, string>().set(1, 'number').set('1', 'string');
table.get(1);   // 'number'
table.get('1'); // 'string'
table.delete(1);
```

### Открытая адресация — `OpenAddressingHashMap`

Все записи лежат прямо в массиве. При коллизии ищется следующая свободная ячейка (линейное пробирование). Удалённые слоты помечаются «надгробиями», чтобы не рвать цепочки поиска.

```ts
import { OpenAddressingHashMap } from './src/data-structures/hashing/open-addressing-hash-map.js';

const map = new OpenAddressingHashMap<string, number>().set('a', 1).set('b', 2);
map.get('b');    // 2
map.delete('a'); // true
```

### Фильтр Блума — `BloomFilter`

Вероятностное множество: «точно нет» или «возможно да». Ложноотрицательных ответов не бывает. Размер битового массива и число хешей считаются из ожидаемого количества элементов и допустимой доли ложных срабатываний.

```ts
import { BloomFilter } from './src/data-structures/hashing/bloom-filter.js';

const seen = new BloomFilter(10_000, 0.01);
seen.add('alice@example.com');
seen.mightContain('alice@example.com'); // true
seen.mightContain('bob@example.com');   // false (с вероятностью ~99%)
```

### LRU-кеш — `LRUCache`

Map плюс двусвязный список. При переполнении вытесняется ключ, к которому дольше всех не обращались. `get`/`set` O(1).

```ts
import { LRUCache } from './src/data-structures/hashing/lru-cache.js';

const cache = new LRUCache<string, number>(2);
cache.set('a', 1).set('b', 2);
cache.get('a');  // 1, теперь 'a' самый свежий
cache.set('c', 3); // вытесняет 'b'
cache.keys();    // ['c', 'a']
```

## Деревья

### Бинарное дерево поиска — `BinarySearchTree`

Слева меньшие ключи, справа большие. Операции O(h): в среднем O(log n), на отсортированных данных вырождается в O(n). Умеет `min`, `max`, `floor`, `ceil` и in-order обход.

```ts
import { BinarySearchTree } from './src/data-structures/trees/binary-search-tree.js';

const tree = BinarySearchTree.from([50, 30, 70, 20, 40, 60, 80]);
tree.floor(65); // 60
tree.ceil(65);  // 70
tree.delete(30);
[...tree];      // [20, 40, 50, 60, 70, 80]
```

### AVL-дерево — `AVLTree`

Самобалансирующееся BST: высоты поддеревьев отличаются не больше чем на 1, баланс держится поворотами. Гарантированно O(log n).

```ts
import { AVLTree } from './src/data-structures/trees/avl-tree.js';

const tree = new AVLTree<number>();
for (let i = 0; i < 1023; i++) tree.insert(i);
tree.height();     // 10, хотя вставляли по возрастанию
tree.isBalanced(); // true
```

### Красно-чёрное дерево — `RedBlackTree`

Балансировка через раскраску узлов: корень и листья чёрные, у красного узла нет красных детей, на любом пути одинаковое число чёрных узлов. Высота не больше 2·log₂(n+1). Такие деревья лежат под `TreeMap` в Java и `std::map` в C++.

```ts
import { RedBlackTree } from './src/data-structures/trees/red-black-tree.js';

const tree = new RedBlackTree<number>();
[10, 20, 30, 15, 25].forEach((n) => tree.insert(n));
tree.delete(20);
tree.isValid(); // true, все инварианты соблюдены
tree.toArray(); // [10, 15, 25, 30]
```

### B-дерево — `BTree`

Сильно ветвящееся сбалансированное дерево: в каждом узле от t−1 до 2t−1 ключей, все листья на одной глубине. Основа индексов в базах данных и файловых системах: высота очень маленькая.

```ts
import { BTree } from './src/data-structures/trees/b-tree.js';

const tree = new BTree<number>(16);
for (let i = 0; i < 10_000; i++) tree.insert(i);
tree.height(); // 4 или меньше
tree.delete(5000);
tree.has(5000); // false
```

### Префиксное дерево — `Trie`

Дерево символов для словарей и автодополнения. Операции O(длина слова).

```ts
import { Trie } from './src/data-structures/trees/trie.js';

const trie = Trie.from(['car', 'card', 'care', 'cat', 'dog']);
trie.wordsWithPrefix('car'); // ['car', 'card', 'care']
trie.countWithPrefix('ca');  // 4
trie.startsWith('do');       // true
trie.delete('dog');
```

## Запросы на отрезках

### Дерево отрезков — `SegmentTree`

Отвечает на запрос «агрегат на [l, r]» и обновляет точку за O(log n). Работает с любой ассоциативной операцией и её нейтральным элементом, включая некоммутативные (например, конкатенацию строк).

```ts
import { SegmentTree, minSegmentTree, sumSegmentTree } from './src/data-structures/range-queries/segment-tree.js';

const sums = sumSegmentTree([5, 2, 8, 1, 9]);
sums.query(1, 3); // 11
sums.update(2, 0);
sums.query(1, 3); // 3

minSegmentTree([5, 2, 8, 1, 9]).query(0, 2); // 2

const text = new SegmentTree('abcdef'.split(''), (a, b) => a + b, '');
text.query(1, 4); // 'bcde'
```

### Дерево отрезков с ленивым распространением — `LazySegmentTree`

Прибавление к целому отрезку и сумма на отрезке, обе операции за O(log n). Обновления копятся в узлах и спускаются вниз только при необходимости.

```ts
import { LazySegmentTree } from './src/data-structures/range-queries/lazy-segment-tree.js';

const tree = new LazySegmentTree([1, 2, 3, 4, 5]);
tree.rangeAdd(1, 3, 10); // [1, 12, 13, 14, 5]
tree.rangeSum(0, 4);     // 45
```

### Дерево Фенвика — `FenwickTree`

Компактная структура для префиксных сумм с точечными изменениями. O(log n) на операцию, памяти n+1 чисел.

```ts
import { FenwickTree } from './src/data-structures/range-queries/fenwick-tree.js';

const fenwick = new FenwickTree([3, 2, -1, 6, 5]);
fenwick.prefixSum(2);   // 4
fenwick.add(1, 10);
fenwick.rangeSum(1, 3); // 17
```

### Разреженная таблица — `SparseTable`

Предподсчёт за O(n log n), запрос за O(1). Подходит только для статичных массивов и идемпотентных операций (min, max, gcd).

```ts
import { minSparseTable } from './src/data-structures/range-queries/sparse-table.js';

const rmq = minSparseTable([7, 2, 3, 0, 5, 10, 3, 12, 18]);
rmq.query(0, 4); // 0
rmq.query(4, 7); // 3
```

### Sqrt-декомпозиция — `SqrtDecomposition`

Массив делится на блоки размером √n, для каждого хранится сумма. Запрос и обновление за O(√n). Простая и гибкая альтернатива дереву отрезков.

```ts
import { SqrtDecomposition } from './src/data-structures/range-queries/sqrt-decomposition.js';

const blocks = new SqrtDecomposition([1, 5, 2, 4, 6, 1, 3, 5, 7]);
blocks.rangeSum(2, 6); // 16
blocks.update(4, 0);
blocks.rangeSum(2, 6); // 10
```

## Графы

### Граф — `Graph`

Ориентированный или неориентированный взвешенный граф на списках смежности с вершинами любого типа. Экспортируется в матрицу смежности и в числовой список смежности, с которым работают алгоритмы ниже.

```ts
import { Graph } from './src/data-structures/graphs/graph.js';

const graph = new Graph<string>().addEdge('a', 'b', 3).addEdge('b', 'c');
graph.neighbors('b');      // ['a', 'c']
graph.toAdjacencyMatrix(); // { vertices: ['a','b','c'], matrix: [[0,3,0],[3,0,1],[0,1,0]] }

const roads = new Graph<number>(true).addEdge(1, 2).addEdge(2, 3);
roads.hasEdge(2, 1); // false
```

### Система непересекающихся множеств — `DisjointSet`

Union-Find со сжатием путей и объединением по размеру: почти O(1) на операцию (обратная функция Аккермана). Используется в алгоритме Краскала и для поиска компонент.

```ts
import { DisjointSet } from './src/data-structures/graphs/disjoint-set.js';

const sets = new DisjointSet(5);
sets.union(0, 1);
sets.union(1, 2);
sets.connected(0, 2); // true
sets.count;           // 3
```

---

# Алгоритмы

## Сортировки

Все функции возвращают новый массив и принимают необязательный компаратор (кроме целочисленных сортировок).

```ts
import { bubbleSort, mergeSort, quickSort, countingSort, radixSort } from './src/algorithms/sorting/index.js';

quickSort([5, 2, 9, 1]);                              // [1, 2, 5, 9]
mergeSort(['pear', 'fig', 'kiwi'], (a, b) => a.length - b.length); // ['fig', 'pear', 'kiwi']
countingSort([3, -1, 2, -1]);                         // [-1, -1, 2, 3]
radixSort([170, -45, 75, 90, 2]);                     // [-45, 2, 75, 90, 170]
```

| Алгоритм | Функция | Лучший | Средний | Худший | Память | Стабильна |
|---|---|---|---|---|---|---|
| Пузырьком | `bubbleSort` | O(n) | O(n²) | O(n²) | O(1) | да |
| Шейкерная | `cocktailShakerSort` | O(n) | O(n²) | O(n²) | O(1) | да |
| Выбором | `selectionSort` | O(n²) | O(n²) | O(n²) | O(1) | нет |
| Вставками | `insertionSort` | O(n) | O(n²) | O(n²) | O(1) | да |
| Шелла | `shellSort` | O(n log n) | ~O(n^1.25) | O(n^1.5) | O(1) | нет |
| Слиянием | `mergeSort`, `bottomUpMergeSort` | O(n log n) | O(n log n) | O(n log n) | O(n) | да |
| Быстрая | `quickSort`, `quickSortFunctional` | O(n log n) | O(n log n) | O(n²) | O(log n) | нет |
| Пирамидальная | `heapSort` | O(n log n) | O(n log n) | O(n log n) | O(1) | нет |
| Timsort | `timSort` | O(n) | O(n log n) | O(n log n) | O(n) | да |
| Подсчётом | `countingSort` | O(n + k) | O(n + k) | O(n + k) | O(k) | да |
| Поразрядная | `radixSort` | O(d·n) | O(d·n) | O(d·n) | O(n) | да |
| Блочная | `bucketSort` | O(n) | O(n) | O(n²) | O(n) | да |

- **Пузырьком**: соседние элементы меняются местами, пока массив не отсортирован. Если за проход не было обменов, сортировка останавливается раньше.
- **Шейкерная**: пузырёк, который ходит в обе стороны, поэтому «черепахи» (маленькие элементы в конце) уходят быстрее.
- **Выбором**: на каждом шаге минимум ставится на своё место.
- **Вставками**: каждый элемент вставляется в уже отсортированную левую часть. Очень быстра на почти отсортированных данных.
- **Шелла**: вставки с уменьшающимся шагом (последовательность Кнута 1, 4, 13, 40…).
- **Слиянием**: рекурсивно делим пополам и сливаем. `bottomUpMergeSort` делает то же итеративно.
- **Быстрая**: случайный опорный элемент и трёхпутевое разбиение (меньше / равно / больше), поэтому много дублей не ломают производительность. Рекурсия заменена явным стеком.
- **Пирамидальная**: строим max-кучу прямо в массиве и по одному переносим максимум в конец.
- **Timsort**: короткие прогоны сортируются вставками, потом сливаются. Упрощённая версия алгоритма из Python и V8.
- **Подсчётом**: считаем, сколько раз встретилось каждое значение. Поддерживает отрицательные числа.
- **Поразрядная (LSD)**: устойчиво раскладываем числа по корзинам цифра за цифрой. Отрицательные обрабатываются отдельно.
- **Блочная**: раскидываем значения по диапазонам и сортируем каждую корзину вставками. Хороша для равномерно распределённых данных.

## Поиск

### Линейный поиск — `linearSearch`, `linearSearchAll`

Перебор всех элементов, O(n). Работает на неотсортированных данных.

```ts
import { linearSearch, linearSearchAll } from './src/algorithms/searching/linear-search.js';

linearSearch([1, 4, 5, 8], 5);                       // 2
linearSearchAll([1, 4, 5, 8, 5], (v) => v === 5);    // [2, 4]
```

### Бинарный поиск — `binarySearch`, `lowerBound`, `upperBound`, `firstTrue`

Деление отсортированного диапазона пополам, O(log n). `lowerBound` даёт первую позицию ≥ x, `upperBound` первую позицию > x, `firstTrue` ищет первую точку, где монотонный предикат становится истинным (бинпоиск по ответу).

```ts
import { binarySearch, firstTrue, lowerBound, upperBound } from './src/algorithms/searching/binary-search.js';

binarySearch([1, 3, 5, 7, 9], 7);  // 3
lowerBound([1, 2, 2, 2, 5], 2);    // 1
upperBound([1, 2, 2, 2, 5], 2);    // 4
firstTrue(0, 100, (x) => x * x >= 50); // 8
```

### Поиск прыжками — `jumpSearch`

Прыгаем блоками по √n, затем линейно проверяем блок. O(√n).

```ts
import { jumpSearch } from './src/algorithms/searching/jump-search.js';

jumpSearch([0, 1, 2, 3, 5, 8, 13, 21, 34, 55], 21); // 7
```

### Интерполяционный поиск — `interpolationSearch`

Позиция угадывается пропорционально значению. На равномерно распределённых данных O(log log n).

```ts
import { interpolationSearch } from './src/algorithms/searching/interpolation-search.js';

interpolationSearch([10, 20, 30, 40, 50, 60], 40); // 3
```

### Экспоненциальный поиск — `exponentialSearch`

Удваиваем границу, пока не перешагнём цель, затем ищем бинарно в найденном диапазоне. O(log i), где i — позиция элемента. Удобен для очень больших и неограниченных массивов.

```ts
import { exponentialSearch } from './src/algorithms/searching/exponential-search.js';

exponentialSearch([2, 3, 4, 10, 40, 55, 70], 10); // 3
```

### Тернарный поиск — `ternarySearchMax`, `ternarySearchMin`, `findPeakIndex`

Экстремум унимодальной функции: отрезок каждый раз сужается на треть. `findPeakIndex` находит пик «горы» в массиве.

```ts
import { findPeakIndex, ternarySearchMax } from './src/algorithms/searching/ternary-search.js';

ternarySearchMax((x) => -((x - 3) ** 2), -10, 10); // ≈ 3
findPeakIndex([1, 3, 8, 12, 4, 2]);                // 3
```

### Quickselect — `quickSelect`, `median`

k-я порядковая статистика без полной сортировки, в среднем O(n).

```ts
import { median, quickSelect } from './src/algorithms/searching/quick-select.js';

quickSelect([7, 10, 4, 3, 20, 15], 2); // 7, третий по величине (k с нуля)
median([4, 1, 3, 2]);                  // 2.5
```

## Графовые алгоритмы

Работают с вершинами-числами `0..n-1`: невзвешенный граф — `number[][]`, взвешенный — `{ to, weight }[][]`. Хелперы `toUndirected` и `toWeightedUndirected` из `graphs/types.ts` строят такие списки из рёбер.

### Поиск в ширину — `bfs`, `shortestPathUnweighted`, `gridShortestPath`

Обход «волной» по уровням. Даёт кратчайшие пути в невзвешенном графе. O(V + E).

```ts
import { bfs, gridShortestPath, shortestPathUnweighted } from './src/algorithms/graphs/bfs.js';

const graph = [[1, 2], [5], [3, 4], [5], [5], [6], []];
bfs(graph, 0).distance;                // [0, 1, 1, 2, 2, 2, 3]
shortestPathUnweighted(graph, 0, 6);   // [0, 1, 5, 6]
gridShortestPath(['..#.', '..#.', '....'], [0, 0], [0, 3]); // 7
```

### Поиск в глубину — `dfs`, `dfsRecursive`, `hasPath`

Идём вглубь до упора, потом возвращаемся. O(V + E). Итеративная версия не упирается в лимит стека вызовов.

```ts
import { dfs, hasPath } from './src/algorithms/graphs/dfs.js';

dfs([[1, 2], [5], [3, 4], [5], [5], [6], []], 0); // [0, 1, 5, 6, 2, 3, 4]
hasPath([[1], [2], []], 0, 2);                    // true
```

### Заливка — `floodFill`

Перекрашивает связную область одного цвета, как «ведро» в Paint.

```ts
import { floodFill } from './src/algorithms/graphs/flood-fill.js';

floodFill([[1, 1, 0], [1, 0, 0], [1, 1, 1]], 0, 0, 2); // [[2,2,0],[2,0,0],[2,2,2]]
```

### Топологическая сортировка — `topologicalSortKahn`, `topologicalSortDfs`

Упорядочивает вершины DAG так, что каждое ребро идёт слева направо (порядок сборки, зависимости задач). Если есть цикл, возвращает `null`.

```ts
import { topologicalSortKahn } from './src/algorithms/graphs/topological-sort.js';

topologicalSortKahn([[1, 2], [3], [3], []]); // [0, 1, 2, 3]
topologicalSortKahn([[1], [2], [0]]);        // null
```

### Поиск циклов — `hasCycleDirected`, `hasCycleUndirected`

Ориентированный граф проверяется через топологическую сортировку, неориентированный через Union-Find.

```ts
import { hasCycleUndirected } from './src/algorithms/graphs/cycle-detection.js';

hasCycleUndirected(3, [[0, 1], [1, 2], [2, 0]]); // true
```

### Двудольность — `isBipartite`, `bipartiteColoring`

Можно ли раскрасить вершины в 2 цвета так, чтобы соседи были разного цвета (нет нечётных циклов).

```ts
import { bipartiteColoring } from './src/algorithms/graphs/bipartite.js';
import { toUndirected } from './src/algorithms/graphs/types.js';

bipartiteColoring(toUndirected(4, [[0, 1], [1, 2], [2, 3], [3, 0]])); // [0, 1, 0, 1]
```

### Компоненты связности — `connectedComponents`

```ts
import { connectedComponents } from './src/algorithms/graphs/connected-components.js';
import { toUndirected } from './src/algorithms/graphs/types.js';

connectedComponents(toUndirected(6, [[0, 1], [2, 3], [3, 4]])); // [[0, 1], [2, 3, 4], [5]]
```

### Сильно связные компоненты — `tarjanScc`, `kosarajuScc`

Максимальные группы вершин, где из каждой можно дойти до каждой. Тарьян справляется одним DFS, Косараю двумя (по графу и по транспонированному). Оба O(V + E).

```ts
import { tarjanScc } from './src/algorithms/graphs/strongly-connected-components.js';

tarjanScc([[1], [2], [0, 3], [4], [5], [3], []]); // [[3, 4, 5], [0, 1, 2], [6]]
```

### Мосты и точки сочленения — `findBridgesAndArticulationPoints`

Рёбра и вершины, удаление которых разваливает граф на части. Ищутся через времена входа DFS и `low`-значения.

```ts
import { findBridgesAndArticulationPoints } from './src/algorithms/graphs/bridges-and-articulation-points.js';
import { toUndirected } from './src/algorithms/graphs/types.js';

const graph = toUndirected(7, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3], [5, 6]]);
findBridgesAndArticulationPoints(graph);
// { bridges: [[1, 3], [5, 6]], articulationPoints: [1, 3, 5] }
```

### Эйлеров путь — `eulerianPathDirected`

Путь, проходящий по каждому ребру ровно один раз (алгоритм Хирхольцера), O(E).

```ts
import { eulerianPathDirected } from './src/algorithms/graphs/eulerian-path.js';

eulerianPathDirected([[1], [2], [0, 3], []]); // [2, 0, 1, 2, 3]
```

### Дейкстра — `dijkstra`, `dijkstraPath`

Кратчайшие пути от одной вершины при неотрицательных весах. На бинарной куче O((V + E) log V).

```ts
import { dijkstraPath } from './src/algorithms/graphs/dijkstra.js';

const graph = [
  [{ to: 1, weight: 4 }, { to: 2, weight: 1 }],
  [{ to: 3, weight: 1 }],
  [{ to: 1, weight: 2 }, { to: 3, weight: 5 }],
  [{ to: 4, weight: 3 }],
  [],
];
dijkstraPath(graph, 0, 4); // { distance: 7, path: [0, 2, 1, 3, 4] }
```

### Беллман-Форд — `bellmanFord`

Работает с отрицательными весами и обнаруживает отрицательные циклы. O(V·E).

```ts
import { bellmanFord } from './src/algorithms/graphs/bellman-ford.js';

bellmanFord(3, [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 5 },
  { from: 1, to: 2, weight: -3 },
], 0); // { distance: [0, 4, 1], hasNegativeCycle: false, ... }
```

### Флойд-Уоршелл — `floydWarshall`, `floydWarshallPath`

Кратчайшие пути между всеми парами вершин по матрице весов (`Infinity` означает «ребра нет»). O(V³).

```ts
import { floydWarshall, floydWarshallPath } from './src/algorithms/graphs/floyd-warshall.js';

const { distance, next } = floydWarshall([
  [0, 3, Infinity],
  [Infinity, 0, 1],
  [2, Infinity, 0],
]);
distance[0][2];                  // 4
floydWarshallPath(next, 0, 2);   // [0, 1, 2]
```

### A* — `aStar`, `aStarGrid`

Дейкстра с эвристикой, которая подсказывает направление к цели. Обобщённая версия работает с любыми узлами, `aStarGrid` ищет путь в лабиринте с манхэттенской эвристикой.

```ts
import { aStarGrid } from './src/algorithms/graphs/a-star.js';

aStarGrid(['..#.', '..#.', '....'], [0, 0], [0, 3]);
// [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[1,3],[0,3]]
```

### Минимальное остовное дерево — `kruskal`, `prim`

Самый дешёвый набор рёбер, связывающий все вершины. Краскал сортирует рёбра и склеивает компоненты через Union-Find, Прим растит дерево от одной вершины через кучу. Оба O(E log E).

```ts
import { kruskal, prim } from './src/algorithms/graphs/minimum-spanning-tree.js';
import { toWeightedUndirected } from './src/algorithms/graphs/types.js';

const edges = [
  { from: 0, to: 1, weight: 1 },
  { from: 1, to: 2, weight: 2 },
  { from: 0, to: 2, weight: 3 },
];
kruskal(3, edges).weight;                   // 3
prim(toWeightedUndirected(3, edges)).weight; // 3
```

### Максимальный поток — `edmondsKarp`

Форд-Фалкерсон с поиском увеличивающих путей в ширину. O(V·E²).

```ts
import { edmondsKarp } from './src/algorithms/graphs/max-flow.js';

edmondsKarp([
  [0, 16, 13, 0, 0, 0],
  [0, 0, 10, 12, 0, 0],
  [0, 4, 0, 0, 14, 0],
  [0, 0, 9, 0, 0, 20],
  [0, 0, 0, 7, 0, 4],
  [0, 0, 0, 0, 0, 0],
], 0, 5); // 23
```

## Алгоритмы на деревьях

### Обходы бинарного дерева — `preOrder`, `inOrder`, `postOrder`, `levelOrder`

Итеративные обходы. `fromLevelOrder` строит дерево из массива в формате LeetCode.

```ts
import { fromLevelOrder, inOrder, levelOrder, maxDepth, preOrder } from './src/algorithms/trees/binary-tree.js';

const root = fromLevelOrder([8, 3, 10, 1, 6, null, 14]);
preOrder(root);   // [8, 3, 1, 6, 10, 14]
inOrder(root);    // [1, 3, 6, 8, 10, 14]
levelOrder(root); // [[8], [3, 10], [1, 6, 14]]
maxDepth(root);   // 3
```

Там же лежат `isValidBst`, `invertTree`, `maxValue` и `lowestCommonAncestorBst`.

### Наименьший общий предок — `LowestCommonAncestor`

Двоичный подъём: предподсчёт O(n log n), запрос O(log n). Попутно считает расстояние между вершинами.

```ts
import { LowestCommonAncestor } from './src/algorithms/trees/lowest-common-ancestor.js';
import { toUndirected } from './src/algorithms/graphs/types.js';

const tree = toUndirected(6, [[0, 1], [0, 2], [1, 3], [1, 4], [4, 5]]);
const lca = new LowestCommonAncestor(tree, 0);
lca.lca(3, 5);      // 1
lca.distance(3, 2); // 3
```

### Диаметр дерева — `treeDiameter`

Самый длинный путь в дереве: два BFS (от любой вершины к самой дальней, затем от неё).

```ts
import { treeDiameter } from './src/algorithms/trees/tree-diameter.js';
import { toUndirected } from './src/algorithms/graphs/types.js';

treeDiameter(toUndirected(5, [[0, 1], [1, 2], [1, 3], [3, 4]])); // { length: 3, path: [...] }
```

## Динамическое программирование

### Мемоизация — `memoize`

Кеширует результаты чистой функции. По умолчанию ключ — сам аргумент, для нескольких аргументов `JSON.stringify`.

```ts
import { memoize } from './src/algorithms/dynamic-programming/memoize.js';

const slowSquare = (n: number) => n * n;
const square = memoize(slowSquare);
square(4); // считает
square(4); // берёт из square.cache
```

### Числа Фибоначчи — `fibonacci`, `fibonacciMemo`, `fibonacciFast`, `fibonacciRecursive`

Четыре подхода: наивная рекурсия O(2ⁿ), мемоизация O(n), итерация на BigInt O(n), fast doubling O(log n).

```ts
import { fibonacci, fibonacciFast } from './src/algorithms/dynamic-programming/fibonacci.js';

fibonacci(100);     // 354224848179261915075n
fibonacciFast(100); // то же самое за O(log n)
```

### Рюкзак — `knapsack01`, `unboundedKnapsack`

0/1: каждый предмет берём не больше одного раза, O(n·W), плюс восстановление набора. Неограниченный: предметы можно брать сколько угодно.

```ts
import { knapsack01 } from './src/algorithms/dynamic-programming/knapsack.js';

knapsack01([
  { weight: 1, value: 1 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
  { weight: 5, value: 7 },
], 7); // { value: 9, items: [1, 2] }
```

### Размен монет — `minCoins`, `coinChangeWays`

Минимум монет для суммы (с восстановлением набора) и число способов набрать сумму.

```ts
import { coinChangeWays, minCoins } from './src/algorithms/dynamic-programming/coin-change.js';

minCoins([1, 3, 4], 6);         // { count: 2, coins: [3, 3] }, жадный дал бы 4+1+1
coinChangeWays([1, 2, 5], 5);   // 4
```

### Наибольшая общая подпоследовательность и подстрока

```ts
import { longestCommonSubsequence, longestCommonSubstring } from './src/algorithms/dynamic-programming/longest-common-subsequence.js';

longestCommonSubsequence('AGGTAB', 'GXTXAYB'); // 'GTAB'
longestCommonSubstring('xabcdey', 'zzbcdq');   // 'bcd'
```

### Наибольшая возрастающая подпоследовательность — `longestIncreasingSubsequence`

O(n log n) через массив «хвостов» и бинарный поиск, с восстановлением ответа.

```ts
import { longestIncreasingSubsequence } from './src/algorithms/dynamic-programming/longest-increasing-subsequence.js';

longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18]); // [2, 3, 7, 18]
```

### Расстояние Левенштейна — `editDistance`

Минимум вставок, удалений и замен, чтобы превратить одну строку в другую. Память O(min), хранятся две строки таблицы.

```ts
import { editDistance } from './src/algorithms/dynamic-programming/edit-distance.js';

editDistance('kitten', 'sitting'); // 3
```

### Максимальный подмассив — `maxSubarray`

Алгоритм Кадане, O(n). Возвращает сумму и границы.

```ts
import { maxSubarray } from './src/algorithms/dynamic-programming/max-subarray.js';

maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // { sum: 6, start: 3, end: 6 }
```

### Порядок перемножения матриц — `matrixChainOrder`

Минимальное число скалярных умножений и оптимальная расстановка скобок. O(n³).

```ts
import { matrixChainOrder } from './src/algorithms/dynamic-programming/matrix-chain.js';

matrixChainOrder([10, 30, 5, 60]); // { cost: 4500, order: '((A1A2)A3)' }
```

### Разрезание стержня — `rodCutting`

```ts
import { rodCutting } from './src/algorithms/dynamic-programming/rod-cutting.js';

rodCutting([1, 5, 8, 9, 10, 17, 17, 20], 8); // { revenue: 22, pieces: [2, 6] }
```

### Сумма подмножества — `subsetSum`, `canPartition`

```ts
import { canPartition, subsetSum } from './src/algorithms/dynamic-programming/subset-sum.js';

subsetSum([3, 34, 4, 12, 5, 2], 9); // [4, 5]
canPartition([1, 5, 11, 5]);        // true: [1, 5, 5] и [11]
```

### Разбиение на слова — `wordBreak`

```ts
import { wordBreak } from './src/algorithms/dynamic-programming/word-break.js';

wordBreak('applepenapple', ['apple', 'pen']); // ['apple', 'pen', 'apple']
```

### Пути в сетке — `uniquePaths`, `minPathSum`

```ts
import { minPathSum, uniquePaths } from './src/algorithms/dynamic-programming/grid-paths.js';

uniquePaths(3, 7);                             // 28
minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]); // 7
```

## Строки

Все функции поиска подстроки возвращают массив позиций вхождений.

| Алгоритм | Функция | Время | Идея |
|---|---|---|---|
| Кнут-Моррис-Пратт | `kmpSearch`, `prefixFunction` | O(n + m) | префикс-функция не даёт откатываться по тексту |
| Z-функция | `zSearch`, `zFunction` | O(n + m) | длина совпадения с префиксом для каждой позиции |
| Рабин-Карп | `rabinKarp` | O(n + m) в среднем | скользящий полиномиальный хеш |
| Бойер-Мур-Хорспул | `boyerMooreHorspool` | O(n/m) в лучшем | сравнение с конца, таблица сдвигов |

```ts
import { kmpSearch, prefixFunction } from './src/algorithms/strings/kmp.js';
import { rabinKarp } from './src/algorithms/strings/rabin-karp.js';

kmpSearch('abracadabra', 'abra');  // [0, 7]
rabinKarp('aaaa', 'aa');           // [0, 1, 2]
prefixFunction('aabaaab');         // [0, 1, 0, 1, 2, 2, 3]
```

### Ахо-Корасик — `AhoCorasick`

Поиск сразу многих шаблонов за один проход: бор плюс суффиксные ссылки. O(n + m + количество совпадений).

```ts
import { AhoCorasick } from './src/algorithms/strings/aho-corasick.js';

new AhoCorasick(['he', 'she', 'his', 'hers']).search('ahishers');
// [{ pattern: 'his', index: 1 }, { pattern: 'she', index: 3 }, { pattern: 'he', index: 4 }, { pattern: 'hers', index: 4 }]
```

### Манакер — `longestPalindromicSubstring`

Самый длинный палиндром за O(n).

```ts
import { longestPalindromicSubstring } from './src/algorithms/strings/manacher.js';

longestPalindromicSubstring('forgeeksskeegfor'); // 'geeksskeeg'
```

### Суффиксный массив и LCP — `suffixArray`, `lcpArray`, `countDistinctSubstrings`

Отсортированные начала всех суффиксов (удвоение префиксов) и длины общих префиксов соседних суффиксов (алгоритм Касаи).

```ts
import { countDistinctSubstrings, lcpArray, suffixArray } from './src/algorithms/strings/suffix-array.js';

suffixArray('banana');                     // [5, 3, 1, 0, 4, 2]
lcpArray('banana', suffixArray('banana')); // [1, 3, 0, 0, 2]
countDistinctSubstrings('abab');           // 7
```

### Утилиты — `string-utils.ts`

```ts
import { groupAnagrams, isAnagram, isBalanced, isPalindrome, runLengthEncode } from './src/algorithms/strings/string-utils.js';

isBalanced('(hello)[world]{!}');               // true
isBalanced('([)]');                            // false
isPalindrome('A man, a plan, a canal: Panama'); // true
isAnagram('listen', 'silent');                 // true
groupAnagrams(['eat', 'tea', 'tan', 'nat']);   // [['eat', 'tea'], ['tan', 'nat']]
runLengthEncode('aaabccdddd');                 // '3a1b2c4d'
```

## Математика

### НОД и НОК — `gcd`, `lcm`, `extendedGcd`, `modInverse`

Алгоритм Евклида. Расширенная версия находит коэффициенты Безу, через которые считается обратный элемент по модулю.

```ts
import { extendedGcd, gcd, lcm, modInverse } from './src/algorithms/math/gcd.js';

gcd(48, 18);          // 6
lcm(4, 6);            // 12
extendedGcd(240, 46); // { gcd: 2, x: -9, y: 47 }
modInverse(3, 11);    // 4, потому что 3·4 ≡ 1 (mod 11)
```

### Степени и корни — `fastPower`, `modPow`, `integerSqrt`, `newtonSqrt`

Бинарное возведение в степень O(log n) и метод Ньютона.

```ts
import { fastPower, integerSqrt, modPow } from './src/algorithms/math/power.js';

fastPower(2, 10);                 // 1024
modPow(2n, 100n, 1_000_000_007n); // 976371285n
integerSqrt(99);                  // 9
```

### Простые числа — `primes.ts`

- `sieveOfEratosthenes(n)`: решето Эратосфена, O(n log log n).
- `linearSieve(n)`: линейное решето, заодно даёт минимальный делитель каждого числа.
- `isPrime(n)`: перебор делителей вида 6k±1, O(√n).
- `millerRabin(n)`: детерминированный тест Миллера-Рабина для BigInt (точен для всех 64-битных чисел).
- `primeFactors`, `divisors`, `eulerPhi`: разложение на множители, делители, функция Эйлера.

```ts
import { eulerPhi, millerRabin, primeFactors, sieveOfEratosthenes } from './src/algorithms/math/primes.js';

sieveOfEratosthenes(20);     // [2, 3, 5, 7, 11, 13, 17, 19]
millerRabin(2n ** 61n - 1n); // true
primeFactors(360);           // Map { 2 => 3, 3 => 2, 5 => 1 }
eulerPhi(36);                // 12
```

### Матрицы — `matrix.ts`

Умножение, транспонирование, возведение в степень, определитель и решение СЛАУ методом Гаусса с выбором главного элемента.

```ts
import { determinant, matrixPower, multiply, solveLinearSystem } from './src/algorithms/math/matrix.js';

multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]); // [[19, 22], [43, 50]]
matrixPower([[1, 1], [1, 0]], 10);           // [[89, 55], [55, 34]], числа Фибоначчи
determinant([[2, -3, 1], [2, 0, -1], [1, 4, 5]]); // 49
solveLinearSystem([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]); // [2, 3, -1]
```

### Комбинаторика — `combinatorics.ts`

```ts
import { binomial, catalan, factorial, nextPermutation, pascalTriangle } from './src/algorithms/math/combinatorics.js';

factorial(20);       // 2432902008176640000n
binomial(52, 5);     // 2598960n
catalan(5);          // 42n
pascalTriangle(4);   // [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]

const perm = [1, 2, 3];
nextPermutation(perm); // true, perm = [1, 3, 2]
```

### Системы счисления — `toBase`, `fromBase`, `toRoman`, `fromRoman`

```ts
import { fromRoman, toBase, toRoman } from './src/algorithms/math/number-conversion.js';

toBase(255, 16);     // 'ff'
toRoman(1994);       // 'MCMXCIV'
fromRoman('MMXXVI'); // 2026
```

## Перебор с возвратом (backtracking)

Строим решение по шагу и откатываемся, когда ветка заведомо не подходит.

```ts
import { combinations, combinationSum, permutations, subsets } from './src/algorithms/backtracking/permutations.js';
import { countNQueens, nQueens } from './src/algorithms/backtracking/n-queens.js';
import { solveSudoku } from './src/algorithms/backtracking/sudoku.js';
import { wordSearch } from './src/algorithms/backtracking/word-search.js';

permutations([1, 2, 3]).length;    // 6
combinations([1, 2, 3, 4], 2);     // [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
subsets(['a', 'b']);               // [[], ['b'], ['a'], ['a', 'b']]
combinationSum([2, 3, 6, 7], 7);   // [[2, 2, 3], [7]]

nQueens(4);       // [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]
countNQueens(8);  // 92, битовые маски вместо множеств

solveSudoku(board);                            // решённая доска 9×9 или null
wordSearch(['ABCE', 'SFCS', 'ADEE'], 'ABCCED'); // true
```

## Жадные алгоритмы

На каждом шаге берём локально лучший вариант. Работает только там, где это доказуемо даёт глобальный оптимум.

```ts
import { activitySelection, mergeIntervals, minMeetingRooms } from './src/algorithms/greedy/activity-selection.js';
import { fractionalKnapsack } from './src/algorithms/greedy/fractional-knapsack.js';
import { huffmanDecode, huffmanEncode } from './src/algorithms/greedy/huffman.js';
import { canReachEnd, greedyChange, minJumps } from './src/algorithms/greedy/jump-game.js';

activitySelection([{ start: 1, end: 4 }, { start: 3, end: 5 }, { start: 5, end: 7 }]); // [{1,4}, {5,7}]
mergeIntervals([{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }]);   // [{1,6}, {8,10}]
minMeetingRooms([{ start: 0, end: 30 }, { start: 5, end: 10 }, { start: 15, end: 20 }]); // 2

fractionalKnapsack([{ weight: 10, value: 60 }, { weight: 20, value: 100 }, { weight: 30, value: 120 }], 50); // 240

const { encoded, codes } = huffmanEncode('abracadabra'); // 23 бита вместо 88
huffmanDecode(encoded, codes);                           // 'abracadabra'

canReachEnd([2, 3, 1, 1, 4]);         // true
minJumps([2, 3, 1, 1, 4]);            // 2
greedyChange(289, [1, 5, 10, 25, 100]); // [100, 100, 25, 25, 25, 10, 1, 1, 1, 1]
```

- **Выбор заявок**: сортируем по времени окончания и берём всё, что не пересекается.
- **Код Хаффмана**: префиксный код, частые символы получают короткие коды. Два самых редких узла раз за разом склеиваются через min-кучу.
- **Дробный рюкзак**: берём по убыванию удельной ценности. В отличие от 0/1-рюкзака, здесь жадность оптимальна.

## Техники

### Два указателя — `two-pointers.ts`

```ts
import { containerWithMostWater, dutchNationalFlag, threeSum, twoSum, twoSumSorted } from './src/algorithms/techniques/two-pointers.js';

twoSumSorted([1, 2, 4, 7, 11], 15);     // [2, 4]
twoSum([2, 7, 11, 15], 9);              // [0, 1], через хеш-таблицу
threeSum([-1, 0, 1, 2, -1, -4]);        // [[-1, -1, 2], [-1, 0, 1]]
containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7]); // 49
dutchNationalFlag([2, 0, 2, 1, 1, 0], 1);            // [0, 0, 1, 1, 2, 2]
```

Там же `removeDuplicatesSorted` и `hasCycleFloyd` (черепаха и заяц).

### Скользящее окно — `sliding-window.ts`

```ts
import { longestUniqueSubstring, maxSumWindow, minWindowSubstring, slidingWindowMaximum } from './src/algorithms/techniques/sliding-window.js';

maxSumWindow([1, 4, 2, 10, 23, 3, 1, 0, 20], 4);       // 39
slidingWindowMaximum([1, 3, -1, -3, 5, 3, 6, 7], 3);   // [3, 3, 5, 5, 6, 7], монотонный дек
longestUniqueSubstring('abcabcbb');                    // 'abc'
minWindowSubstring('ADOBECODEBANC', 'ABC');            // 'BANC'
```

### Префиксные суммы — `prefix-sums.ts`

Сумма на отрезке за O(1) после O(n) предподсчёта, есть и двумерная версия.

```ts
import { PrefixSums, PrefixSums2D, differenceArrayApply, majorityElement, subarraySumEquals } from './src/algorithms/techniques/prefix-sums.js';

new PrefixSums([3, 1, 4, 1, 5, 9]).sum(1, 3);                    // 6
new PrefixSums2D([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).sum(1, 1, 2, 2); // 28
subarraySumEquals([1, 1, 1], 2);                                 // 2
differenceArrayApply(5, [[1, 3, 2], [2, 4, 3]]);                 // [0, 2, 5, 5, 3]
majorityElement([2, 2, 1, 1, 1, 2, 2]);                          // 2, голосование Бойера-Мура
```

## Рандомизированные алгоритмы

```ts
import { fisherYatesShuffle, monteCarloPi, mulberry32, reservoirSample } from './src/algorithms/randomized/shuffle.js';

const random = mulberry32(42);                  // воспроизводимый генератор с seed
fisherYatesShuffle([1, 2, 3, 4, 5], random);    // равновероятная перестановка за O(n)
reservoirSample(hugeStream, 10, random);        // 10 случайных элементов из потока неизвестной длины
monteCarloPi(100_000, random);                  // ≈ 3.14
```

## Битовые операции

```ts
import * as bits from './src/algorithms/bit-manipulation/bits.js';

bits.countSetBits(0b1011);           // 3, алгоритм Кернигана
bits.isPowerOfTwo(64);               // true, n & (n - 1) === 0
bits.singleNumber([4, 1, 2, 1, 2]);  // 4, XOR взаимно уничтожает пары
bits.grayCode(3);                    // [0, 1, 3, 2, 6, 7, 5, 4]
bits.reverseBits(1);                 // 2147483648
bits.hammingDistance(1, 4);          // 2
bits.subsetsByMask(['a', 'b']);      // [[], ['a'], ['b'], ['a', 'b']]
```

Ещё есть `getBit`, `setBit`, `clearBit`, `toggleBit`, `lowestSetBit` и `swapWithoutTemp`.

## Вычислительная геометрия

```ts
import { closestPair, convexHull, pointInPolygon, polygonArea, segmentsIntersect } from './src/algorithms/geometry/geometry.js';

const points = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 0, y: 2 }];
const hull = convexHull(points);         // монотонная цепочка Эндрю, O(n log n)
polygonArea(hull);                       // 4, формула шнурования
pointInPolygon({ x: 1, y: 1 }, hull);    // true, метод луча
segmentsIntersect({ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }, { x: 4, y: 0 }); // true
closestPair(points);                     // ближайшая пара, «разделяй и властвуй», O(n log n)
```

---

# Паттерны проектирования

## Порождающие (creational)

Отвечают за то, как создаются объекты, и отвязывают код от конкретных классов.

### Singleton — `AppConfig`, `lazySingleton`

Один экземпляр на всё приложение и глобальная точка доступа к нему. Конструктор приватный. `lazySingleton` даёт ту же идею для функций без классов. Применять осторожно: это скрытая глобальная зависимость, и её сложно подменить в тестах.

```ts
import { AppConfig, lazySingleton } from './src/patterns/creational/singleton.js';

AppConfig.getInstance().set('env', 'prod');
AppConfig.getInstance().get('env'); // 'prod', тот же объект

const getDb = lazySingleton(() => connectToDatabase());
getDb() === getDb(); // true, подключение создаётся один раз
```

### Factory Method — `Logistics`

Базовый класс описывает алгоритм, а подклассы решают, какой именно продукт создать.

```ts
import { createTransport, RoadLogistics, SeaLogistics } from './src/patterns/creational/factory-method.js';

new RoadLogistics().planDelivery('apples'); // 'Truck delivers apples by road'
new SeaLogistics().planDelivery('oil');     // 'Ship delivers oil by sea'
createTransport('ship').kind;               // 'ship', простая фабрика по ключу
```

### Abstract Factory — `ThemeFactory`

Создаёт семейства связанных объектов, которые гарантированно сочетаются между собой (светлые кнопки со светлыми чекбоксами).

```ts
import { DarkThemeFactory, renderSettingsForm } from './src/patterns/creational/abstract-factory.js';

renderSettingsForm(new DarkThemeFactory()); // ['[dark x]', '[dark button: Save]']
```

### Builder — `HttpRequestBuilder`

Пошаговая сборка сложного объекта через fluent-интерфейс. Валидация происходит в `build()`, результат иммутабельный.

```ts
import { HttpRequestBuilder } from './src/patterns/creational/builder.js';

const request = HttpRequestBuilder.post('https://api.example.com/users')
  .param('notify', 1)
  .header('Authorization', 'Bearer token')
  .json({ name: 'Alex' })
  .timeout(5000)
  .build();
// { method: 'POST', url: 'https://api.example.com/users?notify=1', headers: {...}, body: '{"name":"Alex"}', timeoutMs: 5000 }
```

### Prototype — `Shape.clone()`, `PrototypeRegistry`

Новые объекты получаются копированием готовых образцов, без знания их конкретных классов. Копия глубокая.

```ts
import { Circle, PrototypeRegistry, Rectangle, type Shape } from './src/patterns/creational/prototype.js';

const registry = new PrototypeRegistry<Shape>().register('square', new Rectangle(0, 0, 'blue', 3, 3));
const a = registry.create('square');
const b = registry.create('square'); // другой объект с теми же свойствами

const copy = new Circle(0, 0, 'red', 2, ['round']).clone();
```

### Object Pool — `ObjectPool`

Переиспользует дорогие объекты (соединения, буферы) вместо постоянного создания. `use()` гарантирует возврат объекта в пул даже при исключении.

```ts
import { ObjectPool } from './src/patterns/creational/object-pool.js';

const pool = new ObjectPool(() => new Float64Array(1024), (buffer) => buffer.fill(0), 10);
const sum = pool.use((buffer) => buffer.reduce((a, b) => a + b, 0));
```

## Структурные (structural)

Отвечают за то, как из объектов и классов собираются более крупные структуры.

### Adapter — `FahrenheitSensorAdapter`, `promisify`

Приводит несовместимый интерфейс к тому, который ожидает клиент.

```ts
import { averageTemperature, FahrenheitSensorAdapter, LegacyFahrenheitSensor, promisify } from './src/patterns/structural/adapter.js';

const sensor = new FahrenheitSensorAdapter(new LegacyFahrenheitSensor(212));
sensor.celsius(); // 100

const readFileAsync = promisify(legacyReadFile); // callback API превращается в Promise
```

### Bridge — `RemoteControl` + `Device`

Абстракция (пульт) и реализация (устройство) развиваются независимо: любой пульт работает с любым устройством.

```ts
import { AdvancedRemoteControl, Radio, RemoteControl, Tv } from './src/patterns/structural/bridge.js';

const tv = new Tv();
new RemoteControl(tv).togglePower();
new AdvancedRemoteControl(new Radio()).mute();
```

### Composite — `Directory` + `FileEntry`

Дерево объектов, где листья и контейнеры работают через один интерфейс.

```ts
import { Directory, FileEntry } from './src/patterns/structural/composite.js';

const root = new Directory('root').add(
  new FileEntry('a.txt', 100),
  new Directory('src').add(new FileEntry('index.ts', 250)),
);
root.size();   // 350
root.render(); // ['root/ (350)', '  a.txt (100)', '  src/ (250)', '    index.ts (250)']
```

### Decorator — `NotifierDecorator`, `withLogging`

Добавляет поведение, оборачивая объект в обёртки с тем же интерфейсом. Обёртки можно комбинировать в любом порядке.

```ts
import { EmailNotifier, SlackNotifier, SmsNotifier, withLogging } from './src/patterns/structural/decorator.js';

const notifier = new SlackNotifier(new SmsNotifier(new EmailNotifier('ops@x.io'), '+100'), 'alerts');
notifier.send('server down'); // email, sms и slack

const add = withLogging((a: number, b: number) => a + b, console.log, 'add');
add(2, 3); // логирует 'add(2, 3)' и 'add -> 5'
```

### Facade — `VideoConverter`

Один простой метод вместо возни с несколькими подсистемами.

```ts
import { VideoConverter } from './src/patterns/structural/facade.js';

new VideoConverter().convert('movie.ogg', 'mp4');
```

### Flyweight — `TreeTypeFactory`

Экономит память: общее (внутреннее) состояние хранится один раз и разделяется между тысячами объектов.

```ts
import { Forest } from './src/patterns/structural/flyweight.js';

const forest = new Forest();
for (let i = 0; i < 1000; i++) forest.plant(i, i, i % 2 ? 'oak' : 'pine', 'green', 'bark.png');
forest.treeCount; // 1000
forest.typeCount; // 2
```

### Proxy — `CachingWeatherProxy`, `AccessControlProxy`, `createValidatedObject`

Заместитель с тем же интерфейсом контролирует доступ к объекту: кеширует, проверяет права, валидирует. Последний пример построен на встроенном `Proxy`.

```ts
import { CachingWeatherProxy, createValidatedObject } from './src/patterns/structural/proxy.js';

const weather = new CachingWeatherProxy(realService, 60_000);
await weather.temperature('Kyiv'); // запрос к сервису
await weather.temperature('Kyiv'); // из кеша

const user = createValidatedObject({ age: 20 }, (key, value) => key !== 'age' || (typeof value === 'number' && value >= 0));
user.age = -1; // TypeError
```

## Поведенческие (behavioral)

Отвечают за взаимодействие объектов и распределение обязанностей.

### Chain of Responsibility — `SupportHandler`

Запрос передаётся по цепочке обработчиков, пока какой-нибудь его не обработает.

```ts
import { createSupportChain } from './src/patterns/behavioral/chain-of-responsibility.js';

const support = createSupportChain(); // бот, затем агент, затем инженер
support.handle({ topic: 'password', severity: 1 }); // 'Bot: Use the "Forgot password" link'
support.handle({ topic: 'outage', severity: 3 });   // 'Engineer fixed outage'
```

### Command — `CommandHistory`

Действие оформляется объектом. Отсюда undo/redo, очереди, макросы и логирование операций.

```ts
import { CommandHistory, DeleteCommand, InsertCommand, TextDocument } from './src/patterns/behavioral/command.js';

const doc = new TextDocument();
const history = new CommandHistory();
history.run(new InsertCommand(doc, 0, 'Hello world'));
history.run(new DeleteCommand(doc, 0, 6)); // 'world'
history.undo();                            // 'Hello world'
history.redo();                            // 'world'
```

### Interpreter — `parseExpression`

Грамматика языка задаётся классами-выражениями. Здесь это арифметика с переменными и рекурсивный нисходящий парсер.

```ts
import { parseExpression } from './src/patterns/behavioral/interpreter.js';

const expr = parseExpression('2 * (x + 3) - y / 2');
expr.interpret({ x: 4, y: 10 }); // 9
expr.toString();                 // '((2 * (x + 3)) - (y / 2))'
```

### Iterator — `NumberRange`, `depthFirst`, `breadthFirst`, `take`

Последовательный обход коллекции без раскрытия её устройства. Есть классический вариант (`hasNext`/`next`) и идиоматичный JS на генераторах.

```ts
import { breadthFirst, NumberRange, take } from './src/patterns/behavioral/iterator.js';

[...new NumberRange(0, 10, 3)];        // [0, 3, 6, 9]
[...breadthFirst(tree)];               // обход дерева по уровням
[...take(infiniteGenerator(), 3)];     // ленивая выборка
```

### Mediator — `ChatRoom`

Объекты общаются через посредника, а не напрямую, поэтому связей «каждый с каждым» не возникает.

```ts
import { ChatRoom, ChatUser } from './src/patterns/behavioral/mediator.js';

const room = new ChatRoom();
const alice = new ChatUser('alice');
const bob = new ChatUser('bob');
room.join(alice);
room.join(bob);
alice.say('hi all');
bob.inbox; // ['alice: hi all']
```

### Memento — `Editor` + `EditorHistory`

Сохраняет снимок состояния и потом восстанавливает его, не нарушая инкапсуляцию.

```ts
import { Editor, EditorHistory } from './src/patterns/behavioral/memento.js';

const editor = new Editor();
const history = new EditorHistory(editor);
editor.type('Hello');
history.backup();
editor.type(' world');
history.undo();
editor.text; // 'Hello'
```

### Observer — `Subject`, `BehaviorSubject`

Подписчики автоматически получают уведомления об изменениях. `subscribe` возвращает функцию отписки. `BehaviorSubject` сразу отдаёт новому подписчику текущее значение.

```ts
import { BehaviorSubject, StockTicker } from './src/patterns/behavioral/observer.js';

const ticker = new StockTicker();
const unsubscribe = ticker.changes.subscribe(({ symbol, change }) => console.log(symbol, change));
ticker.update('AAPL', 100);
ticker.update('AAPL', 105); // AAPL 5
unsubscribe();

const theme = new BehaviorSubject('light');
theme.subscribe(console.log); // сразу печатает 'light'
```

### State — `Order`

Поведение объекта зависит от состояния, и каждое состояние оформлено отдельным классом. Недопустимые переходы бросают ошибку, никаких `switch` по статусу.

```ts
import { Order } from './src/patterns/behavioral/state.js';

const order = new Order();
order.pay();
order.ship();
order.cancel();  // Error: Cannot cancel an order in state "shipped"
order.deliver();
order.history;   // ['new', 'paid', 'shipped', 'delivered']
```

### Strategy — `ShippingCalculator`

Семейство взаимозаменяемых алгоритмов, которые выбираются во время выполнения.

```ts
import { FlatRateShipping, FreeOverThresholdShipping, ShippingCalculator, WeightBasedShipping } from './src/patterns/behavioral/strategy.js';

const calculator = new ShippingCalculator(new FlatRateShipping(10));
calculator.calculate({ weightKg: 2.3, orderTotal: 80 }); // 10
calculator.setStrategy(new WeightBasedShipping(4));
calculator.calculate({ weightKg: 2.3, orderTotal: 80 }); // 12
```

### Template Method — `SalesDataMiner`

Скелет алгоритма (parse, затем validate, затем report) задан в базовом классе, подклассы переопределяют отдельные шаги.

```ts
import { CsvSalesMiner } from './src/patterns/behavioral/template-method.js';

new CsvSalesMiner().mine('product,amount\napple,10\npear,5\napple,7');
// { total: 22, topProduct: 'apple', records: 3 }
```

### Visitor — `ShapeVisitor`

Новые операции над иерархией объектов добавляются без изменения самих классов (double dispatch).

```ts
import { AreaVisitor, CircleShape, JsonExportVisitor, RectangleShape } from './src/patterns/behavioral/visitor.js';

const shapes = [new CircleShape(1), new RectangleShape(2, 3)];
shapes.map((shape) => shape.accept(new AreaVisitor()));       // [3.14159…, 6]
shapes.map((shape) => shape.accept(new JsonExportVisitor())); // ['{"type":"circle","radius":1}', ...]
```

## Архитектурные и прикладные

Паттерны уровня приложения, которые постоянно встречаются в реальных TypeScript-проектах.

### Dependency Injection — `Container`

Зависимости не создаются внутри класса, а передаются извне. Контейнер умеет типизированные токены, singleton- и transient-время жизни и ловит циклические зависимости.

```ts
import { Container, token } from './src/patterns/architectural/dependency-injection.js';

const CONFIG = token<{ url: string }>('config');
const DB = token<Database>('db');

const container = new Container()
  .value(CONFIG, { url: 'postgres://localhost' })
  .register(DB, (c) => new Database(c.resolve(CONFIG)));

container.resolve(DB); // Database, тип выводится из токена
```

### Repository + Specification

Repository прячет хранилище за интерфейсом коллекции. Specification выносит бизнес-правила отбора в комбинируемые объекты (`and`/`or`/`not`).

```ts
import { InMemoryRepository } from './src/patterns/architectural/repository.js';
import { spec } from './src/patterns/architectural/specification.js';

const users = new InMemoryRepository<User>();
await users.save({ id: '1', name: 'Ann', age: 17, active: true });

const adult = spec<User>((u) => u.age >= 18);
const active = spec<User>((u) => u.active);
await users.findAll(adult.and(active));
```

### Typed Event Emitter — `TypedEventEmitter`

Pub/Sub с проверкой имён событий и типов payload на этапе компиляции.

```ts
import { TypedEventEmitter } from './src/patterns/architectural/event-emitter.js';

const events = new TypedEventEmitter<{ login: { user: string }; logout: undefined }>();
events.on('login', ({ user }) => console.log(user));
events.once('logout', () => console.log('bye'));
events.emit('login', { user: 'alex' });
```

### Middleware / Pipeline — `compose`, `Pipeline`

Цепочка обработчиков по модели «луковицы» (как в Koa и Express): каждый может что-то сделать до и после `next()` или прервать обработку.

```ts
import { Pipeline } from './src/patterns/architectural/middleware.js';

await new Pipeline<{ path: string; status?: number }>()
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    console.log(ctx.path, Date.now() - start, 'ms');
  })
  .use((ctx, next) => (ctx.path === '/admin' ? void (ctx.status = 403) : next()))
  .use((ctx) => void (ctx.status = 200))
  .run({ path: '/' });
```

### Null Object — `NullLogger`

Объект-заглушка с пустым поведением вместо `null`, поэтому проверки `if (logger)` по всему коду не нужны.

```ts
import { MemoryLogger, PaymentService } from './src/patterns/architectural/null-object.js';

new PaymentService().charge(10);                   // логов нет, проверок на null тоже
new PaymentService(new MemoryLogger()).charge(10); // логирует
```

### Store (Flux / Redux) — `createStore`, `combineReducers`

Единое хранилище состояния. Изменения идут только через `dispatch(action)` и чистые редьюсеры.

```ts
import { combineReducers, counterReducer, createStore } from './src/patterns/architectural/store.js';

const store = createStore(counterReducer, 0);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'increment' });          // 1
store.dispatch({ type: 'add', amount: 10 });    // 11
```

### Circuit Breaker + Retry — `CircuitBreaker`, `retry`

Если внешний сервис раз за разом падает, «предохранитель» размыкается и какое-то время сразу отвечает ошибкой, не нагружая его. Через `resetTimeoutMs` пропускается пробный запрос (half-open). `retry` повторяет операцию с экспоненциальной задержкой.

```ts
import { CircuitBreaker, retry } from './src/patterns/architectural/circuit-breaker.js';

const breaker = new CircuitBreaker((id: string) => fetchUser(id), { failureThreshold: 3, resetTimeoutMs: 10_000 });
await breaker.call('42');
breaker.state; // 'closed' | 'open' | 'half-open'

await retry(() => fetch('https://api.example.com'), { attempts: 5, delayMs: 100 });
```
