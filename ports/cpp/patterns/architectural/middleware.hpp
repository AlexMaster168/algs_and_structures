#pragma once
#include "../../support.hpp"
namespace algs {
using Next = std::function<std::future<void>()>;
template<class C> using Middleware = std::function<std::future<void>(C&, Next)>;
inline std::future<void> completedFuture() { std::promise<void> promise; promise.set_value(); return promise.get_future(); }
template<class C> std::function<std::future<void>(C&)> compose(std::vector<Middleware<C>> middlewares) { return [middlewares = std::move(middlewares)](C& context) { struct State { C& context; std::vector<Middleware<C>> middlewares; int last = -1; }; auto state = std::make_shared<State>(State{context, middlewares}); auto dispatch = std::make_shared<std::function<std::future<void>(int)>>(); std::weak_ptr<std::function<std::future<void>(int)>> weak = dispatch; *dispatch = [state, weak](int index) { if (index <= state->last) throw std::logic_error("next() called multiple times"); state->last = index; if (index == int(state->middlewares.size())) return completedFuture(); auto owner = weak.lock(); return state->middlewares[index](state->context, [owner, index] { return (*owner)(index + 1); }); }; return std::async(std::launch::async, [dispatch] { (*dispatch)(0).get(); }); }; }
template<class C> class Pipeline { std::vector<Middleware<C>> middlewares; public: Pipeline& use(Middleware<C> middleware) { middlewares.push_back(std::move(middleware)); return *this; } std::future<void> run(C& context) const { return compose<C>(middlewares)(context); } };
}
