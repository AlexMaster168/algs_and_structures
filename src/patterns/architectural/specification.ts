export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export class Spec<T> implements Specification<T> {
  constructor(private readonly predicate: (candidate: T) => boolean) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.predicate(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new Spec((candidate) => this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate));
  }

  or(other: Specification<T>): Specification<T> {
    return new Spec((candidate) => this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate));
  }

  not(): Specification<T> {
    return new Spec((candidate) => !this.isSatisfiedBy(candidate));
  }
}

export const spec = <T>(predicate: (candidate: T) => boolean): Specification<T> => new Spec(predicate);
