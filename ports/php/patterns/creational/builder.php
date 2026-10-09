<?php
declare(strict_types=1);
namespace Ports\Patterns\Creational;

readonly class HttpRequest { public function __construct(public string $method, public string $url, public array $headers, public ?string $body, public int|float $timeoutMs) {} }
class HttpRequestBuilder {
    private string $method = 'GET', $baseUrl = '';
    private array $query = [], $headers = [];
    private ?string $body = null;
    private int|float $timeoutMs = 30000;
    public static function get(string $url): self { return (new self())->url($url); }
    public static function post(string $url): self { return (new self())->url($url)->withMethod('POST'); }
    public function url(string $value): static { $this->baseUrl = $value; return $this; }
    public function withMethod(string $value): static { $this->method = $value; return $this; }
    public function header(string $name, string $value): static { $this->headers[strtolower($name)] = $value; return $this; }
    public function param(string $name, string|int|float $value): static { $this->query[] = [$name, (string)$value]; return $this; }
    public function json(mixed $payload): static { $this->body = json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); return $this->header('content-type', 'application/json'); }
    public function timeout(int|float $value): static { $this->timeoutMs = $value; return $this; }
    public function build(): HttpRequest {
        if ($this->baseUrl === '') throw new \LogicException('URL is required'); if ($this->body !== null && $this->method === 'GET') throw new \LogicException('GET request cannot have a body');
        $query = implode('&', array_map(fn($pair) => urlencode($pair[0]) . '=' . urlencode($pair[1]), $this->query));
        return new HttpRequest($this->method, $this->baseUrl . ($query !== '' ? '?' . $query : ''), $this->headers, $this->body, $this->timeoutMs);
    }
}
