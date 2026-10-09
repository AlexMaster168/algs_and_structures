package behavioral

type ChatMediator interface {
	Join(*ChatUser)
	Send(*ChatUser, string, ...string)
}
type ChatUser struct {
	Name  string
	Inbox []string
	room  ChatMediator
}

func (u *ChatUser) Attach(room ChatMediator) { u.room = room }
func (u *ChatUser) Say(message string, to ...string) {
	if u.room == nil {
		panic(u.Name + " is not in a room")
	}
	u.room.Send(u, message, to...)
}
func (u *ChatUser) Receive(from, message string) { u.Inbox = append(u.Inbox, from+": "+message) }

type ChatRoom struct {
	users map[string]*ChatUser
	order []string
}

func (r *ChatRoom) Join(user *ChatUser) {
	if r.users == nil {
		r.users = map[string]*ChatUser{}
	}
	if _, ok := r.users[user.Name]; !ok {
		r.order = append(r.order, user.Name)
	}
	r.users[user.Name] = user
	user.Attach(r)
}
func (r *ChatRoom) Send(from *ChatUser, message string, to ...string) {
	if len(to) > 0 {
		if user := r.users[to[0]]; user != nil {
			user.Receive(from.Name, message)
		}
		return
	}
	for _, name := range r.order {
		user := r.users[name]
		if user != from {
			user.Receive(from.Name, message)
		}
	}
}
