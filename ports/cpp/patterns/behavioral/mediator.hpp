#pragma once
#include "../../support.hpp"
namespace algs {
class ChatUser;
struct ChatMediator { virtual ~ChatMediator() = default; virtual void join(ChatUser& user) = 0; virtual void send(ChatUser& from, const std::string& message, const std::optional<std::string>& to = {}) = 0; };
class ChatUser { ChatMediator* room = nullptr; public: const std::string name; std::vector<std::string> inbox; explicit ChatUser(std::string name): name(std::move(name)) {} void attach(ChatMediator& mediator) { room = &mediator; } void say(const std::string& message, const std::optional<std::string>& to = {}) { if (!room) throw std::logic_error(name + " is not in a room"); room->send(*this, message, to); } void receive(const std::string& from, const std::string& message) { inbox.push_back(from + ": " + message); } };
class ChatRoom : public ChatMediator { std::map<std::string, ChatUser*> users; public: void join(ChatUser& user) override { users[user.name] = &user; user.attach(*this); } void send(ChatUser& from, const std::string& message, const std::optional<std::string>& to = {}) override { if (to) { auto it = users.find(*to); if (it != users.end()) it->second->receive(from.name, message); } else for (auto& [name, user] : users) if (user != &from) user->receive(from.name, message); } };
}
