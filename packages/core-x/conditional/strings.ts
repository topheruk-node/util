import { Predicate } from "../functional/mod";

export const isUpperCase: Predicate<string> = (char: string) => char === char.toUpperCase();

export const isLowerCase: Predicate<string> = (char: string) => !isUpperCase(char);