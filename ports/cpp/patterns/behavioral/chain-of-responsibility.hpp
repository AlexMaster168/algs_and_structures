#pragma once
#include "../../support.hpp"
namespace algs {
struct Ticket { std::string topic; int severity; };
class SupportHandler { std::shared_ptr<SupportHandler> next; protected: virtual bool canHandle(const Ticket&) const = 0; virtual std::string resolve(const Ticket&) const = 0; public: virtual ~SupportHandler() = default; SupportHandler& setNext(std::shared_ptr<SupportHandler> handler) { next = std::move(handler); return *next; } std::string handle(const Ticket& ticket) const { if (canHandle(ticket)) return resolve(ticket); return next ? next->handle(ticket) : "Unresolved: " + ticket.topic; } };
class FaqBot : public SupportHandler { protected: bool canHandle(const Ticket& ticket) const override { return ticket.severity == 1 && (ticket.topic == "password" || ticket.topic == "delivery"); } std::string resolve(const Ticket& ticket) const override { return ticket.topic == "password" ? "Bot: Use the \"Forgot password\" link" : "Bot: Delivery takes 3-5 days"; } };
class SupportAgent : public SupportHandler { protected: bool canHandle(const Ticket& ticket) const override { return ticket.severity <= 2; } std::string resolve(const Ticket& ticket) const override { return "Agent resolved " + ticket.topic; } };
class Engineer : public SupportHandler { protected: bool canHandle(const Ticket&) const override { return true; } std::string resolve(const Ticket& ticket) const override { return "Engineer fixed " + ticket.topic; } };
inline std::shared_ptr<SupportHandler> createSupportChain() { auto bot = std::make_shared<FaqBot>(); bot->setNext(std::make_shared<SupportAgent>()).setNext(std::make_shared<Engineer>()); return bot; }
}
