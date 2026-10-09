<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

interface Expression { public function interpret(array $context): int|float; }
readonly class NumberExpression implements Expression { public function __construct(public int|float $value) {} public function interpret(array $context = []): int|float { return $this->value; } }
readonly class VariableExpression implements Expression { public function __construct(public string $name) {} public function interpret(array $context): int|float { return $context[$this->name]; } }
readonly class BinaryExpression implements Expression {
    public function __construct(public string $operator, public Expression $left, public Expression $right) {}
    public function interpret(array $context): int|float { $a = $this->left->interpret($context); $b = $this->right->interpret($context); return match($this->operator) { '+' => $a + $b, '-' => $a - $b, '*' => $a * $b, '/' => $a / $b, default => throw new \LogicException('Unknown operator') }; }
}
function parseExpression(string $source): Expression {
    preg_match_all('/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*\/()]/', $source, $matches); $tokens = $matches[0]; $position = 0;
    $peek = function() use ($tokens, &$position): ?string { return $tokens[$position] ?? null; };
    $consume = function() use ($tokens, &$position): string { return $tokens[$position++] ?? throw new \UnexpectedValueException('Unexpected end'); };
    $sum = null;
    $primary = function() use ($consume, &$sum): Expression {
        $token = $consume(); if ($token === '(') { $value = $sum(); if ($consume() !== ')') throw new \UnexpectedValueException('Expected )'); return $value; }
        if (is_numeric($token)) return new NumberExpression((float)$token); if (ctype_alpha($token[0]) || $token[0] === '_') return new VariableExpression($token); throw new \UnexpectedValueException('Unexpected token');
    };
    $product = function() use ($peek, $consume, $primary): Expression { $value = $primary(); while (in_array($peek(), ['*', '/'], true)) $value = new BinaryExpression($consume(), $value, $primary()); return $value; };
    $sum = function() use ($peek, $consume, $product): Expression { $value = $product(); while (in_array($peek(), ['+', '-'], true)) $value = new BinaryExpression($consume(), $value, $product()); return $value; };
    $value = $sum(); if ($position !== count($tokens)) throw new \UnexpectedValueException('Unexpected token'); return $value;
}
