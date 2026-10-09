use super::command::slice;
use std::cell::RefCell;
use std::rc::Rc;
#[derive(Clone)]
pub struct EditorSnapshot {
    pub content: String,
    pub cursor: usize,
}
#[derive(Default)]
pub struct Editor {
    content: String,
    cursor: usize,
}
impl Editor {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn text(&self) -> &str {
        &self.content
    }
    pub fn cursor_position(&self) -> usize {
        self.cursor
    }
    pub fn type_text(&mut self, text: &str) {
        self.content = format!(
            "{}{}{}",
            slice(&self.content, 0, Some(self.cursor as isize)),
            text,
            slice(&self.content, self.cursor as isize, None)
        );
        self.cursor += text.encode_utf16().count();
    }
    pub fn move_cursor(&mut self, position: isize) {
        self.cursor = position.clamp(0, self.content.encode_utf16().count() as isize) as usize;
    }
    pub fn save(&self) -> EditorSnapshot {
        EditorSnapshot {
            content: self.content.clone(),
            cursor: self.cursor,
        }
    }
    pub fn restore(&mut self, snapshot: EditorSnapshot) {
        self.content = snapshot.content;
        self.cursor = snapshot.cursor;
    }
}
pub struct EditorHistory {
    editor: Rc<RefCell<Editor>>,
    snapshots: Vec<EditorSnapshot>,
}
impl EditorHistory {
    pub fn new(editor: Rc<RefCell<Editor>>) -> Self {
        Self {
            editor,
            snapshots: Vec::new(),
        }
    }
    pub fn backup(&mut self) {
        self.snapshots.push(self.editor.borrow().save());
    }
    pub fn undo(&mut self) -> bool {
        if let Some(snapshot) = self.snapshots.pop() {
            self.editor.borrow_mut().restore(snapshot);
            true
        } else {
            false
        }
    }
}
