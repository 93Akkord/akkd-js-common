declare global {
    interface Array<T> {
        /**
         * Clears all items from the array and sets the length to 0.
         * @memberof Array
         */
        clear(): void;
        /**
         * Appends unique elements to an array, and returns the new length of the array.
         * @param {...T[]} items Items to append to Array.
         * @returns {number} length of Array.
         * @memberof Array
         */
        pushUnique(...items: T[]): number;
        /**
         * Convert an Array with non unique values to an Array with unique values.
         *
         * @param {boolean} [inPlace] = false
         * @returns {(T[] | void)}
         * @memberof Array
         */
        distinct(inPlace?: boolean): T[] | void;
        getPartialMatches(compare: string, caseSensitive: boolean): T[];
        containsPartial(compare: string, caseSensitive: boolean): boolean;
        containsPartialArray<T>(compareArray: T[]): T[];
        forEachAsync(func: Function): void;
        forEachAsyncParallel(func: Function): void;
        sliceArgs(): any[];
    }
}
export {};
