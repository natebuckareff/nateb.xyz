export function or<T, R>(value: T, fn: (x: NonNullable<T>) => R): R | undefined {
    if (value != null) {
        return fn(value);
    }
}
