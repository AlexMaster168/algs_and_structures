<?php
declare(strict_types=1);
namespace Ports\Patterns\Architectural;

readonly class Token { public function __construct(public string $description) {} }
function token(string $description): Token { return new Token($description); }
class Container {
    private array $registrations = [], $resolving = [];
    public function register(Token $target, callable $factory, string $lifetime = 'singleton'): static {
        if (!in_array($lifetime, ['singleton', 'transient'], true)) throw new \InvalidArgumentException('Unknown lifetime');
        $this->registrations[spl_object_id($target)] = ['target' => $target, 'factory' => $factory, 'lifetime' => $lifetime]; return $this;
    }
    public function value(Token $target, mixed $value): static { $this->registrations[spl_object_id($target)] = ['target' => $target, 'factory' => fn() => $value, 'lifetime' => 'singleton', 'instance' => $value]; return $this; }
    public function resolve(Token $target): mixed {
        $key = spl_object_id($target); if (!isset($this->registrations[$key])) throw new \OutOfBoundsException("No provider for $target->description"); $registration = $this->registrations[$key];
        if ($registration['lifetime'] === 'singleton' && array_key_exists('instance', $registration)) return $registration['instance'];
        if (isset($this->resolving[$key])) throw new \LogicException("Circular dependency on $target->description"); $this->resolving[$key] = true;
        try { $instance = $registration['factory']($this); if ($registration['lifetime'] === 'singleton') $this->registrations[$key]['instance'] = $instance; return $instance; }
        finally { unset($this->resolving[$key]); }
    }
}
