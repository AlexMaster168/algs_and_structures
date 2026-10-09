use std::collections::HashSet;

pub fn word_break(text: &str, dictionary: &[String]) -> Option<Vec<String>> {
    let chars: Vec<char> = text.chars().collect();
    let words: HashSet<&str> = dictionary.iter().map(String::as_str).collect();
    let mut reached = vec![None; chars.len() + 1];
    reached[0] = Some(0);
    for end in 1..=chars.len() {
        for start in 0..end {
            if reached[start].is_some() {
                let word: String = chars[start..end].iter().collect();
                if words.contains(word.as_str()) {
                    reached[end] = Some(start);
                    break;
                }
            }
        }
    }
    reached[chars.len()]?;
    let mut result = Vec::new();
    let mut end = chars.len();
    while end > 0 {
        let start = reached[end]?;
        result.push(chars[start..end].iter().collect());
        end = start;
    }
    result.reverse();
    Some(result)
}
