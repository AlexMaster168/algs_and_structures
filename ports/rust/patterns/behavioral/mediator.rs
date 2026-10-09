use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::{Rc, Weak};
pub trait ChatMediator {
    fn join(&self, user: Rc<ChatUser>);
    fn send(&self, from: &ChatUser, message: &str, to: Option<&str>);
}
#[derive(Default)]
struct RoomState {
    users: HashMap<String, Rc<ChatUser>>,
}
pub struct ChatUser {
    pub name: String,
    pub inbox: RefCell<Vec<String>>,
    room: RefCell<Weak<RefCell<RoomState>>>,
}
impl ChatUser {
    pub fn new(name: String) -> Self {
        Self {
            name,
            inbox: RefCell::new(Vec::new()),
            room: RefCell::new(Weak::new()),
        }
    }
    pub fn attach(&self, room: &ChatRoom) {
        *self.room.borrow_mut() = Rc::downgrade(&room.state);
    }
    pub fn say(&self, message: &str, to: Option<&str>) -> Result<(), String> {
        let room = self
            .room
            .borrow()
            .upgrade()
            .ok_or_else(|| format!("{} is not in a room", self.name))?;
        ChatRoom { state: room }.send(self, message, to);
        Ok(())
    }
    pub fn receive(&self, from: &str, message: &str) {
        self.inbox.borrow_mut().push(format!("{from}: {message}"));
    }
}
#[derive(Default)]
pub struct ChatRoom {
    state: Rc<RefCell<RoomState>>,
}
impl ChatRoom {
    pub fn new() -> Self {
        Self::default()
    }
}
impl ChatMediator for ChatRoom {
    fn join(&self, user: Rc<ChatUser>) {
        user.attach(self);
        self.state
            .borrow_mut()
            .users
            .insert(user.name.clone(), user);
    }
    fn send(&self, from: &ChatUser, message: &str, to: Option<&str>) {
        let state = self.state.borrow();
        if let Some(name) = to {
            if let Some(user) = state.users.get(name) {
                user.receive(&from.name, message);
            }
        } else {
            for user in state.users.values() {
                if !std::ptr::eq(user.as_ref(), from) {
                    user.receive(&from.name, message);
                }
            }
        }
    }
}
