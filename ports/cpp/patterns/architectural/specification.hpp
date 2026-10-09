#pragma once
#include "../../support.hpp"
namespace algs {
template<class T> class Spec { std::function<bool(const T&)> predicate; public: explicit Spec(std::function<bool(const T&)> predicate): predicate(std::move(predicate)) {} bool isSatisfiedBy(const T& candidate) const { return predicate(candidate); } Spec andSpec(Spec other) const { return Spec([a = *this, b = std::move(other)](const T& value) { return a.isSatisfiedBy(value) && b.isSatisfiedBy(value); }); } Spec orSpec(Spec other) const { return Spec([a = *this, b = std::move(other)](const T& value) { return a.isSatisfiedBy(value) || b.isSatisfiedBy(value); }); } Spec notSpec() const { return Spec([a = *this](const T& value) { return !a.isSatisfiedBy(value); }); } };
template<class T> Spec<T> spec(std::function<bool(const T&)> predicate) { return Spec<T>(std::move(predicate)); }
}
