<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

interface ChatMediator { public function join(ChatUser $user): void; public function send(ChatUser $from, string $message, ?string $to = null): void; }
class ChatUser {
    public array $inbox = []; private ?ChatMediator $room = null;
    public function __construct(public readonly string $name) {}
    public function attach(ChatMediator $room): void { $this->room = $room; }
    public function say(string $message, ?string $to = null): void { if (!$this->room) throw new \LogicException("$this->name is not in a room"); $this->room->send($this, $message, $to); }
    public function receive(string $from, string $message): void { $this->inbox[] = "$from: $message"; }
}
class ChatRoom implements ChatMediator {
    private array $users = [];
    public function join(ChatUser $user): void { $this->users[$user->name] = $user; $user->attach($this); }
    public function send(ChatUser $from, string $message, ?string $to = null): void { if ($to !== null) { ($this->users[$to] ?? null)?->receive($from->name, $message); return; } foreach ($this->users as $user) if ($user !== $from) $user->receive($from->name, $message); }
}
