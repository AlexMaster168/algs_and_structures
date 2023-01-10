interface Node {
  value: number;
  nodes?: Node[];
}

let tree: Node[] = [
  {
    value: 12,
    nodes: [
      {value: 3},
      {value: 3},
      {
        value: 5,
        nodes: [{value: 5}],
      },
    ],
  },
  {
    value: 11,
    nodes: [{value: 4}],
  },
];

const recursive = (tree: Node[]): number[] => {
  let elements: number[] = [];
  tree.forEach((node) => {
    elements.push(node.value);
    if (!node.nodes) return node.value;
    elements.push(...recursive(node.nodes));
  });
  return elements;
};

const iteration = (tree: Node[]): number => {
  if (!tree.length) return 0;
  let elem = [],
    stack: Node[] = [];
  tree.forEach((node) => stack.push(node));
  while (stack.length) {
    const node = stack.pop();
    elem.push(node.value);
    if (node.nodes) node.nodes.forEach((child) => stack.push(child));
  }
  return Math.max(...elem);
};

console.log(iteration(tree));
