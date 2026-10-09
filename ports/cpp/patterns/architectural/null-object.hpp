#pragma once
#include "../../support.hpp"
namespace algs {
struct Logger { virtual ~Logger() = default; virtual void info(const std::string& message) = 0; virtual void error(const std::string& message) = 0; };
struct MemoryLogger : Logger { std::vector<std::string> lines; void info(const std::string& message) override { lines.push_back("INFO " + message); } void error(const std::string& message) override { lines.push_back("ERROR " + message); } };
struct NullLogger : Logger { void info(const std::string&) override {} void error(const std::string&) override {} };
class PaymentService { std::shared_ptr<Logger> logger; public: explicit PaymentService(std::shared_ptr<Logger> logger = std::make_shared<NullLogger>()): logger(std::move(logger)) {} bool charge(double amount) { if (amount <= 0) { logger->error("invalid amount " + text(amount)); return false; } logger->info("charged " + text(amount)); return true; } };
}
