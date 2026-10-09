#pragma once
#include "../../support.hpp"
namespace algs {
struct EditorSnapshot { std::string content; std::size_t cursor; };
class Editor { std::string content; std::size_t cursor = 0; public: const std::string& text() const { return content; } std::size_t cursorPosition() const { return cursor; } void type(const std::string& text) { content.insert(cursor, text); cursor += text.size(); } void moveCursor(long long position) { cursor = std::size_t(std::clamp(position, 0LL, static_cast<long long>(content.size()))); } EditorSnapshot save() const { return {content, cursor}; } void restore(const EditorSnapshot& snapshot) { content = snapshot.content; cursor = snapshot.cursor; } };
class EditorHistory { Editor& editor; std::vector<EditorSnapshot> snapshots; public: explicit EditorHistory(Editor& editor): editor(editor) {} void backup() { snapshots.push_back(editor.save()); } bool undo() { if (snapshots.empty()) return false; editor.restore(snapshots.back()); snapshots.pop_back(); return true; } };
}
