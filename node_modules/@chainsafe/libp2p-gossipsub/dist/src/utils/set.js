/**
 * Exclude up to `ineed` items from a set if item meets condition `cond`
 */
export function removeItemsFromSet(superSet, ineed, cond = () => true) {
    const subset = new Set();
    if (ineed <= 0)
        return subset;
    for (const id of superSet) {
        if (subset.size >= ineed)
            break;
        if (cond(id)) {
            subset.add(id);
            superSet.delete(id);
        }
    }
    return subset;
}
/**
 * Exclude up to `ineed` items from a set
 */
export function removeFirstNItemsFromSet(superSet, ineed) {
    return removeItemsFromSet(superSet, ineed, () => true);
}
//# sourceMappingURL=set.js.map