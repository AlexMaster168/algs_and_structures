use std::cell::RefCell;
use std::rc::Rc;
#[derive(Default)]
pub struct TextDocument {
    pub content: String,
}
pub trait Command {
    fn execute(&mut self);
    fn undo(&mut self);
}
pub fn slice(text: &str, from: isize, to: Option<isize>) -> String {
    let units: Vec<_> = text.encode_utf16().collect();
    let position = |i: isize| {
        if i < 0 {
            (units.len() as isize + i).max(0) as usize
        } else {
            (i as usize).min(units.len())
        }
    };
    let left = position(from);
    let right = to.map(position).unwrap_or(units.len());
    String::from_utf16_lossy(&units[left..right.max(left)])
}
pub struct InsertCommand {
    document: Rc<RefCell<TextDocument>>,
    position: isize,
    text: String,
}
impl InsertCommand {
    pub fn new(document: Rc<RefCell<TextDocument>>, position: isize, text: String) -> Self {
        Self {
            document,
            position,
            text,
        }
    }
}
impl Command for InsertCommand {
    fn execute(&mut self) {
        let mut doc = self.document.borrow_mut();
        doc.content = format!(
            "{}{}{}",
            slice(&doc.content, 0, Some(self.position)),
            self.text,
            slice(&doc.content, self.position, None)
        );
    }
    fn undo(&mut self) {
        let mut doc = self.document.borrow_mut();
        doc.content = format!(
            "{}{}",
            slice(&doc.content, 0, Some(self.position)),
            slice(
                &doc.content,
                self.position + self.text.encode_utf16().count() as isize,
                None
            )
        );
    }
}
pub struct DeleteCommand {
    document: Rc<RefCell<TextDocument>>,
    position: isize,
    length: isize,
    removed: String,
}
impl DeleteCommand {
    pub fn new(document: Rc<RefCell<TextDocument>>, position: isize, length: isize) -> Self {
        Self {
            document,
            position,
            length,
            removed: String::new(),
        }
    }
}
impl Command for DeleteCommand {
    fn execute(&mut self) {
        let mut doc = self.document.borrow_mut();
        self.removed = slice(
            &doc.content,
            self.position,
            Some(self.position + self.length),
        );
        doc.content = format!(
            "{}{}",
            slice(&doc.content, 0, Some(self.position)),
            slice(&doc.content, self.position + self.length, None)
        );
    }
    fn undo(&mut self) {
        let mut doc = self.document.borrow_mut();
        doc.content = format!(
            "{}{}{}",
            slice(&doc.content, 0, Some(self.position)),
            self.removed,
            slice(&doc.content, self.position, None)
        );
    }
}
pub struct MacroCommand {
    commands: Vec<Box<dyn Command>>,
}
impl MacroCommand {
    pub fn new(commands: Vec<Box<dyn Command>>) -> Self {
        Self { commands }
    }
}
impl Command for MacroCommand {
    fn execute(&mut self) {
        for command in &mut self.commands {
            command.execute();
        }
    }
    fn undo(&mut self) {
        for command in self.commands.iter_mut().rev() {
            command.undo();
        }
    }
}
#[derive(Default)]
pub struct CommandHistory {
    done: Vec<Box<dyn Command>>,
    undone: Vec<Box<dyn Command>>,
}
impl CommandHistory {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn run(&mut self, mut command: Box<dyn Command>) {
        command.execute();
        self.done.push(command);
        self.undone.clear();
    }
    pub fn undo(&mut self) -> bool {
        if let Some(mut command) = self.done.pop() {
            command.undo();
            self.undone.push(command);
            true
        } else {
            false
        }
    }
    pub fn redo(&mut self) -> bool {
        if let Some(mut command) = self.undone.pop() {
            command.execute();
            self.done.push(command);
            true
        } else {
            false
        }
    }
}
