use std::collections::HashMap;

pub fn is_balanced(input: &str) -> bool {
    let mut stack = Vec::new();
    for c in input.chars() {
        match c {
            '(' | '[' | '{' => stack.push(c),
            ')' | ']' | '}' => {
                let expected = match c {
                    ')' => '(',
                    ']' => '[',
                    _ => '{',
                };
                if stack.pop() != Some(expected) {
                    return false;
                }
            }
            _ => {}
        }
    }
    stack.is_empty()
}

pub fn is_palindrome(input: &str) -> bool {
    let normalized: Vec<char> = input
        .to_lowercase()
        .chars()
        .filter(|c| c.is_alphanumeric())
        .collect();
    normalized.iter().eq(normalized.iter().rev())
}

pub fn is_anagram(a: &str, b: &str) -> bool {
    let mut counts = HashMap::new();
    for c in a.chars() {
        *counts.entry(c).or_insert(0i64) += 1;
    }
    for c in b.chars() {
        *counts.entry(c).or_insert(0) -= 1;
    }
    counts.values().all(|&n| n == 0)
}

pub fn group_anagrams(words: &[String]) -> Vec<Vec<String>> {
    let mut indices = HashMap::new();
    let mut result: Vec<Vec<String>> = Vec::new();
    for word in words {
        let mut chars: Vec<char> = word.chars().collect();
        chars.sort_unstable();
        let key: String = chars.into_iter().collect();
        let index = *indices.entry(key).or_insert_with(|| {
            result.push(Vec::new());
            result.len() - 1
        });
        result[index].push(word.clone());
    }
    result
}

pub fn run_length_encode(input: &str) -> String {
    let mut chars = input.chars().peekable();
    let mut result = String::new();
    while let Some(c) = chars.next() {
        let mut count = 1;
        while chars.peek() == Some(&c) {
            chars.next();
            count += 1;
        }
        result.push_str(&count.to_string());
        result.push(c);
    }
    result
}

pub fn run_length_decode(input: &str) -> String {
    let mut count = 0usize;
    let mut result = String::new();
    for c in input.chars() {
        if let Some(d) = c.to_digit(10) {
            count = count * 10 + d as usize;
        } else {
            for _ in 0..count {
                result.push(c);
            }
            count = 0;
        }
    }
    result
}

pub fn reverse_words(input: &str) -> String {
    input.split_whitespace().rev().collect::<Vec<_>>().join(" ")
}
