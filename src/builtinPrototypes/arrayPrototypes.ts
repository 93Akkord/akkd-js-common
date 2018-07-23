import { equals } from '../helpers/helpers';

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

Array.prototype.clear = function() {
    this.length = 0;
}

Array.prototype.pushUnique = function<T>(...items: T[]): number {
    var index = -1;

    items.forEach(item => {
        for (var i = 0; i < this.length; i++) {
            if (equals(this[i], item))
                index = i;
        }

        if (index === -1)
            this.push(item)
    });

    return this.length;
}

Array.prototype.distinct = function<T>(inPlace: boolean = false): T[] | void {
    var seen: any = {};
    var retArr: T[] = [];

    if (inPlace) {
        var tempArray = this.slice(0);
        this.clear();

        for (var i = 0; i < tempArray.length; i++) {
            if (!(tempArray[i] in seen)) {
                this.push(tempArray[i]);
                seen[tempArray[i]] = true;
            }
        }

        return this;
    } else {
        for (var i = 0; i < this.length; i++) {
            if (!(this[i] in seen)) {
                retArr.push(this[i]);
                seen[this[i]] = true;
            }
        }

        return retArr;
    }
}

Array.prototype.getPartialMatches = function(compare: string, caseSensitive: boolean) {
    var tempArray: Array<string> = [];

    if (caseSensitive == null)
        caseSensitive = true;

    for (let i = 0; i < this.length; i++) {
        const element = this[i];

        if (!caseSensitive) {
            if (element.toLowerCase().includes(compare.toLowerCase()))
                tempArray.push(element);
        } else {
            if (element.includes(compare))
                tempArray.push(element);
        }
    }

    return tempArray;
}

Array.prototype.containsPartial = function(compare: string, caseSensitive: boolean) {
    var tempArray = [];

    if (caseSensitive == null)
        caseSensitive = true;

    for (let i = 0; i < this.length; i++) {
        const element = this[i];

        if (!caseSensitive) {
            if (element.toLowerCase().includes(compare.toLowerCase()))
                tempArray.push(element);
        } else {
            if (element.includes(compare))
                tempArray.push(element);
        }
    }

    return (tempArray.length > 0) ? true : false;
}

Array.prototype.containsPartialArray = function<T>(compareArray: T[]): T[] {
    var tempArray: T[] = [];

    for (let i = 0; i < compareArray.length; i++) {
        const element = compareArray[i];

        tempArray.push.apply(tempArray, this.filter(function(item) {
            var finder = element;
            var result = eval('/' + finder + '/i').test(item);
            return result;
        }));
    }

    return tempArray.distinct(false) as T[];
}

Array.prototype.forEachAsync = async function(func: Function) {
    for (let t of this)
        var result = await func(t);
};

Array.prototype.forEachAsyncParallel = async function(func: Function) {
    await Promise.all(this.map(func as any));
};

Array.prototype.sliceArgs = function(): any[] {
    var a: any[] = [];

    for (let i = 0; i < arguments[0].length; i++)
        a.push(arguments[0][i]);

    return a;
};
