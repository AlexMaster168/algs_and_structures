<?php
declare(strict_types=1);

namespace Ports\Algorithms\Strings;

use function Ports\Shared\units;
class AhoCorasick {
    private array $nodes = [['next'=>[],'fail'=>0,'output'=>[]]]; private array $lengths = [];
    public function __construct(private readonly array $patterns) { foreach ($patterns as $index => $pattern) { $symbols = units($pattern); $this->lengths[$index] = count($symbols); $this->add($symbols,$index); } $this->build(); }
    public function search(string $text): array { $matches = []; $state = 0; foreach (units($text) as $i => $char) { $state = $this->transition($state,$char); foreach ($this->nodes[$state]['output'] as $index) $matches[] = ['pattern'=>$this->patterns[$index],'index'=>$i-$this->lengths[$index]+1]; } return $matches; }
    private function add(array $pattern,int $index): void { if (!$pattern) return; $state = 0; foreach ($pattern as $char) { $next = $this->nodes[$state]['next'][$char] ?? null; if ($next === null) { $next = count($this->nodes); $this->nodes[] = ['next'=>[],'fail'=>0,'output'=>[]]; $this->nodes[$state]['next'][$char] = $next; } $state = $next; } $this->nodes[$state]['output'][] = $index; }
    private function build(): void { $queue = array_values($this->nodes[0]['next']); for ($head = 0; $head < count($queue); $head++) { $state = $queue[$head]; foreach ($this->nodes[$state]['next'] as $char => $child) { $fail = $this->transition($this->nodes[$state]['fail'],$char); $this->nodes[$child]['fail'] = $fail; array_push($this->nodes[$child]['output'],...$this->nodes[$fail]['output']); $queue[] = $child; } } }
    private function transition(int $state,int $char): int { while (true) { $next = $this->nodes[$state]['next'][$char] ?? null; if ($next !== null) return $next; if ($state === 0) return 0; $state = $this->nodes[$state]['fail']; } }
}
