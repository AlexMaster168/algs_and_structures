use crate::data_structures::heaps::binary_heap::BinaryHeap;
use std::collections::{BTreeMap, HashMap};
struct Node {
    weight: usize,
    order: usize,
    symbol: Option<char>,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}
pub fn huffman_codes(text: &str) -> BTreeMap<char, String> {
    let mut index = HashMap::new();
    let mut counts: Vec<(char, usize)> = Vec::new();
    for symbol in text.chars() {
        let length = counts.len();
        let i = *index.entry(symbol).or_insert_with(|| {
            counts.push((symbol, 0));
            length
        });
        counts[i].1 += 1;
    }
    let mut codes = BTreeMap::new();
    if counts.is_empty() {
        return codes;
    }
    if counts.len() == 1 {
        codes.insert(counts[0].0, "0".to_owned());
        return codes;
    }
    let mut heap = BinaryHeap::new(
        |a: &Box<Node>, b| a.weight.cmp(&b.weight).then(a.order.cmp(&b.order)),
        [],
    );
    let mut order = 0;
    for (symbol, weight) in counts {
        heap.push(Box::new(Node {
            weight,
            order,
            symbol: Some(symbol),
            left: None,
            right: None,
        }));
        order += 1;
    }
    while heap.size() > 1 {
        let left = heap.pop().unwrap();
        let right = heap.pop().unwrap();
        heap.push(Box::new(Node {
            weight: left.weight + right.weight,
            order,
            symbol: None,
            left: Some(left),
            right: Some(right),
        }));
        order += 1;
    }
    fn assign(node: &Node, code: String, codes: &mut BTreeMap<char, String>) {
        if let Some(symbol) = node.symbol {
            codes.insert(symbol, code);
        } else {
            assign(node.left.as_ref().unwrap(), format!("{code}0"), codes);
            assign(node.right.as_ref().unwrap(), format!("{code}1"), codes);
        }
    }
    assign(&heap.pop().unwrap(), String::new(), &mut codes);
    codes
}
pub struct HuffmanEncoded {
    pub encoded: String,
    pub codes: BTreeMap<char, String>,
}
pub fn huffman_encode(text: &str) -> HuffmanEncoded {
    let codes = huffman_codes(text);
    let encoded = text.chars().map(|c| codes[&c].as_str()).collect();
    HuffmanEncoded { encoded, codes }
}
pub fn huffman_decode(encoded: &str, codes: &BTreeMap<char, String>) -> String {
    let reverse: HashMap<_, _> = codes
        .iter()
        .map(|(&symbol, code)| (code.as_str(), symbol))
        .collect();
    let mut result = String::new();
    let mut buffer = String::new();
    for bit in encoded.chars() {
        buffer.push(bit);
        if let Some(&symbol) = reverse.get(buffer.as_str()) {
            result.push(symbol);
            buffer.clear();
        }
    }
    result
}
