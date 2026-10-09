export class Spec {
    predicate;
    constructor(predicate) {
        this.predicate = predicate;
    }
    isSatisfiedBy(candidate) {
        return this.predicate(candidate);
    }
    and(other) {
        return new Spec((candidate) => this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate));
    }
    or(other) {
        return new Spec((candidate) => this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate));
    }
    not() {
        return new Spec((candidate) => !this.isSatisfiedBy(candidate));
    }
}
export const spec = (predicate) => new Spec(predicate);
