/**
 * Exclude up to `ineed` items from a set if item meets condition `cond`
 */
export declare function removeItemsFromSet<T>(superSet: Set<T>, ineed: number, cond?: (peer: T) => boolean): Set<T>;
/**
 * Exclude up to `ineed` items from a set
 */
export declare function removeFirstNItemsFromSet<T>(superSet: Set<T>, ineed: number): Set<T>;
//# sourceMappingURL=set.d.ts.map