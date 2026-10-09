class Spec:
    def __init__(self, predicate):
        self.predicate = predicate

    def is_satisfied_by(self, candidate):
        return self.predicate(candidate)

    def and_(self, other):
        return Spec(lambda candidate: self.is_satisfied_by(candidate) and other.is_satisfied_by(candidate))

    def or_(self, other):
        return Spec(lambda candidate: self.is_satisfied_by(candidate) or other.is_satisfied_by(candidate))

    def not_(self):
        return Spec(lambda candidate: not self.is_satisfied_by(candidate))


def spec(predicate):
    return Spec(predicate)
