const map: Map<{id: number}, string> = new Map();
const objKey = {id: 5};
map.set(objKey, 'Alex Master');

console.log(map.get(objKey));

const set: Set<number> = new Set();

set.add(5);
set.add(5);
set.add(5);
set.add(5);
set.add(5);
set.add(4);
set.add(3);
console.log(set);
