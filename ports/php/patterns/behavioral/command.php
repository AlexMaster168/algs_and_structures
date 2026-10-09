<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

class TextDocument { public string $content = ''; }
interface Command { public function execute(): void; public function undo(): void; }
class InsertCommand implements Command {
    public function __construct(private TextDocument $document, private int $position, private string $text) {}
    public function execute(): void { $c = $this->document->content; $this->document->content = mb_substr($c, 0, $this->position) . $this->text . mb_substr($c, $this->position); }
    public function undo(): void { $c = $this->document->content; $this->document->content = mb_substr($c, 0, $this->position) . mb_substr($c, $this->position + mb_strlen($this->text)); }
}
class DeleteCommand implements Command {
    private string $removed = '';
    public function __construct(private TextDocument $document, private int $position, private int $length) {}
    public function execute(): void { $c = $this->document->content; $this->removed = mb_substr($c, $this->position, $this->length); $this->document->content = mb_substr($c, 0, $this->position) . mb_substr($c, $this->position + $this->length); }
    public function undo(): void { $c = $this->document->content; $this->document->content = mb_substr($c, 0, $this->position) . $this->removed . mb_substr($c, $this->position); }
}
class MacroCommand implements Command { public function __construct(private array $commands) {} public function execute(): void { foreach ($this->commands as $command) $command->execute(); } public function undo(): void { foreach (array_reverse($this->commands) as $command) $command->undo(); } }
class CommandHistory {
    private array $done = [], $undone = [];
    public function run(Command $command): void { $command->execute(); $this->done[] = $command; $this->undone = []; }
    public function undo(): bool { if (!$this->done) return false; $command = array_pop($this->done); $command->undo(); $this->undone[] = $command; return true; }
    public function redo(): bool { if (!$this->undone) return false; $command = array_pop($this->undone); $command->execute(); $this->done[] = $command; return true; }
}
