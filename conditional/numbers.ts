import { Predicate } from "../functional/mod";

type Equality = (a: number) => Predicate<number>;

export const isGreaterThan: Equality = a => b => b > a;

export const isGreaterThanZero = isGreaterThan(0);

export const isLessThan: Equality = a => b => !isGreaterThan(a)(b);

export const isLessThanZero = isLessThan(0);