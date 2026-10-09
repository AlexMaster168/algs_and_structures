use std::collections::HashMap;
pub type Context = HashMap<String, f64>;
pub trait Expression {
    fn interpret(&self, context: &Context) -> Result<f64, String>;
    fn to_string(&self) -> String;
}
pub struct NumberExpression {
    value: f64,
}
impl NumberExpression {
    pub fn new(value: f64) -> Self {
        Self { value }
    }
}
impl Expression for NumberExpression {
    fn interpret(&self, _: &Context) -> Result<f64, String> {
        Ok(self.value)
    }
    fn to_string(&self) -> String {
        self.value.to_string()
    }
}
pub struct VariableExpression {
    name: String,
}
impl VariableExpression {
    pub fn new(name: String) -> Self {
        Self { name }
    }
}
impl Expression for VariableExpression {
    fn interpret(&self, context: &Context) -> Result<f64, String> {
        context
            .get(&self.name)
            .copied()
            .ok_or_else(|| format!("Variable {} is not defined", self.name))
    }
    fn to_string(&self) -> String {
        self.name.clone()
    }
}
pub struct BinaryExpression {
    operator: char,
    left: Box<dyn Expression>,
    right: Box<dyn Expression>,
}
impl BinaryExpression {
    pub fn new(operator: char, left: Box<dyn Expression>, right: Box<dyn Expression>) -> Self {
        Self {
            operator,
            left,
            right,
        }
    }
}
impl Expression for BinaryExpression {
    fn interpret(&self, context: &Context) -> Result<f64, String> {
        let a = self.left.interpret(context)?;
        let b = self.right.interpret(context)?;
        match self.operator {
            '+' => Ok(a + b),
            '-' => Ok(a - b),
            '*' => Ok(a * b),
            '/' => Ok(a / b),
            _ => Err("Unknown operator".into()),
        }
    }
    fn to_string(&self) -> String {
        format!(
            "({} {} {})",
            self.left.to_string(),
            self.operator,
            self.right.to_string()
        )
    }
}
pub fn parse_expression(source: &str) -> Result<Box<dyn Expression>, String> {
    let chars: Vec<_> = source.chars().collect();
    let mut tokens = Vec::new();
    let mut i = 0;
    while i < chars.len() {
        let start = i;
        if chars[i].is_ascii_digit() {
            i += 1;
            while i < chars.len() && chars[i].is_ascii_digit() {
                i += 1;
            }
            if i + 1 < chars.len() && chars[i] == '.' && chars[i + 1].is_ascii_digit() {
                i += 1;
                while i < chars.len() && chars[i].is_ascii_digit() {
                    i += 1;
                }
            }
            tokens.push(chars[start..i].iter().collect::<String>());
        } else if chars[i].is_ascii_alphabetic() || chars[i] == '_' {
            i += 1;
            while i < chars.len() && (chars[i].is_ascii_alphanumeric() || chars[i] == '_') {
                i += 1;
            }
            tokens.push(chars[start..i].iter().collect());
        } else {
            if "-+*/()".contains(chars[i]) {
                tokens.push(chars[i].to_string());
            }
            i += 1;
        }
    }
    struct Parser {
        tokens: Vec<String>,
        position: usize,
    }
    impl Parser {
        fn peek(&self) -> &str {
            self.tokens.get(self.position).map_or("", String::as_str)
        }
        fn consume(&mut self) -> Result<String, String> {
            let token = self
                .tokens
                .get(self.position)
                .cloned()
                .ok_or("Unexpected end of expression")?;
            self.position += 1;
            Ok(token)
        }
        fn primary(&mut self) -> Result<Box<dyn Expression>, String> {
            let token = self.consume()?;
            if token == "(" {
                let inner = self.sum()?;
                if self.consume()? != ")" {
                    return Err("Expected )".into());
                }
                return Ok(inner);
            }
            if token.as_bytes()[0].is_ascii_digit() {
                return Ok(Box::new(NumberExpression::new(
                    token.parse::<f64>().map_err(|e| e.to_string())?,
                )));
            }
            if token.as_bytes()[0].is_ascii_alphabetic() || token.starts_with('_') {
                return Ok(Box::new(VariableExpression::new(token)));
            }
            Err(format!("Unexpected token {token}"))
        }
        fn product(&mut self) -> Result<Box<dyn Expression>, String> {
            let mut result = self.primary()?;
            while matches!(self.peek(), "*" | "/") {
                let op = self.consume()?.chars().next().unwrap();
                result = Box::new(BinaryExpression::new(op, result, self.primary()?));
            }
            Ok(result)
        }
        fn sum(&mut self) -> Result<Box<dyn Expression>, String> {
            let mut result = self.product()?;
            while matches!(self.peek(), "+" | "-") {
                let op = self.consume()?.chars().next().unwrap();
                result = Box::new(BinaryExpression::new(op, result, self.product()?));
            }
            Ok(result)
        }
    }
    let mut parser = Parser {
        tokens,
        position: 0,
    };
    let result = parser.sum()?;
    if parser.position != parser.tokens.len() {
        return Err(format!("Unexpected token {}", parser.peek()));
    }
    Ok(result)
}
