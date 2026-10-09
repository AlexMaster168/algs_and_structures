<?php
declare(strict_types=1);
namespace Ports\Patterns\Behavioral;

readonly class EditorSnapshot { public function __construct(public string $content, public int $cursor) {} }
class Editor {
    private string $content = ''; private int $cursor = 0;
    public function __get(string $key): string|int { return $key === 'text' ? $this->content : $this->cursor; }
    public function type(string $text): void { $this->content = mb_substr($this->content, 0, $this->cursor) . $text . mb_substr($this->content, $this->cursor); $this->cursor += mb_strlen($text); }
    public function moveCursor(int $position): void { $this->cursor = max(0, min(mb_strlen($this->content), $position)); }
    public function save(): EditorSnapshot { return new EditorSnapshot($this->content, $this->cursor); }
    public function restore(EditorSnapshot $snapshot): void { $this->content = $snapshot->content; $this->cursor = $snapshot->cursor; }
}
class EditorHistory {
    private array $snapshots = [];
    public function __construct(private Editor $editor) {}
    public function backup(): void { $this->snapshots[] = $this->editor->save(); }
    public function undo(): bool { if (!$this->snapshots) return false; $this->editor->restore(array_pop($this->snapshots)); return true; }
}
