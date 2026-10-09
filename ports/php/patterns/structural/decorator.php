<?php
declare(strict_types=1);
namespace Ports\Patterns\Structural;

interface Notifier { public function send(string $message): array; }
class EmailNotifier implements Notifier { public function __construct(private string $email) {} public function send(string $message): array { return ["email to $this->email: $message"]; } }
abstract class NotifierDecorator implements Notifier { public function __construct(protected Notifier $wrapped) {} public function send(string $message): array { return $this->wrapped->send($message); } }
class SmsNotifier extends NotifierDecorator { public function __construct(Notifier $wrapped, private string $phone) { parent::__construct($wrapped); } public function send(string $message): array { return [...parent::send($message), "sms to $this->phone: $message"]; } }
class SlackNotifier extends NotifierDecorator { public function __construct(Notifier $wrapped, private string $channel) { parent::__construct($wrapped); } public function send(string $message): array { return [...parent::send($message), "slack #$this->channel: $message"]; } }
function withLogging(callable $action, callable $log, string $name = 'anonymous'): \Closure {
    return function(...$args) use ($action, $log, $name): mixed {
        $log($name . '(' . implode(', ', array_map(fn($arg) => json_encode($arg, JSON_THROW_ON_ERROR), $args)) . ')'); $result = $action(...$args); $log($name . ' -> ' . json_encode($result, JSON_THROW_ON_ERROR)); return $result;
    };
}
