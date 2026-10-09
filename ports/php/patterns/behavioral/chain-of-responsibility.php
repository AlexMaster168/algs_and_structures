<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

abstract class SupportHandler {
    private ?SupportHandler $next = null;
    public function setNext(SupportHandler $handler): SupportHandler { $this->next = $handler; return $handler; }
    public function handle(array $ticket): string { return $this->canHandle($ticket) ? $this->resolve($ticket) : ($this->next?->handle($ticket) ?? 'Unresolved: ' . $ticket['topic']); }
    abstract protected function canHandle(array $ticket): bool;
    abstract protected function resolve(array $ticket): string;
}
class FaqBot extends SupportHandler {
    private const ANSWERS = ['password' => 'Use the "Forgot password" link', 'delivery' => 'Delivery takes 3-5 days'];
    protected function canHandle(array $ticket): bool { return $ticket['severity'] === 1 && isset(self::ANSWERS[$ticket['topic']]); }
    protected function resolve(array $ticket): string { return 'Bot: ' . self::ANSWERS[$ticket['topic']]; }
}
class SupportAgent extends SupportHandler { protected function canHandle(array $ticket): bool { return $ticket['severity'] <= 2; } protected function resolve(array $ticket): string { return 'Agent resolved ' . $ticket['topic']; } }
class Engineer extends SupportHandler { protected function canHandle(array $ticket): bool { return true; } protected function resolve(array $ticket): string { return 'Engineer fixed ' . $ticket['topic']; } }
function createSupportChain(): SupportHandler { $bot = new FaqBot(); $bot->setNext(new SupportAgent())->setNext(new Engineer()); return $bot; }
