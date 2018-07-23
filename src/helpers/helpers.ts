// // we must force tsc to interpret this file as a module, resolves
// // "Augmentations for the global scope can only be directly nested in external modules or ambient module declarations."
// // error
// export { }

import '../builtinPrototypes/stringPrototypes';
import '../builtinPrototypes/arrayPrototypes';
import '../builtinPrototypes/jsonPrototypes';
import '../classes/text/StringBuilder';
import { merge, getObjectProperties, getUserDefinedGlobalVars, sortObject, printProps, printPropsNew } from './objectHelpers';
import { dateDiffInDays } from './dateHelpers';

export {
    merge,
    getObjectProperties,
    getUserDefinedGlobalVars,
    sortObject,
    dateDiffInDays,
    printProps,
    printPropsNew
};

const _global = (typeof window !== 'undefined') ? window : global as any;

declare global {
    function pp(obj: any, space?: number): void;
}

_global.pp = pp;

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloat(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
}

export function equals(x: any, y: any) {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (var p in x) {
        if (!x.hasOwnProperty(p)) continue;
        // other properties were tested using x.constructor === y.constructor

        if (!y.hasOwnProperty(p)) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        if (typeof (x[p]) !== "object") return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}

export function isNode(): boolean {
    if (typeof process === 'object' && process + '' === '[object process]')
        return true;
    else
        return false;
}

export function getType(obj: any, getInherited: boolean = false) {
    var typeVar = (function(global) {
        var cache: any = {};
        return function(obj: any) {
            var key;
            if (obj == null) {
                // null
                return 'null';
            } else {
                if (obj == global) {
                    // window in browser or global in nodejs
                    return 'global';
                } else {
                    if ((key = typeof obj) !== 'object') {
                        // basic: string, boolean, number, undefined, function
                        return key;
                    } else {
                        if (obj.nodeType) {
                            'object' // DOM element
                            return 'object';
                        } else {
                            if (obj.constructor != undefined && obj.constructor.name != 'Object' && !getInherited) {
                                return obj.constructor.name;
                            } else {
                                 // cached. date, regexp, error, object, array, math
                                 // and get XXXX from [object XXXX], and cache it
                                return cache[key = ({}).toString.call(obj)] || (cache[key] = key.slice(8, -1));
                            }
                        }
                    }
                }
            }
        };
    }(_global));

    return typeVar(obj);
}

export function removeAllButLastStrPattern(str: string, token: string) {
    var parts = str.split(token);

    if (parts[1] === undefined)
        return str;
    else
        return parts.slice(0, -1).join('') + token + parts.slice(-1)
}

/**
 * Async wait function.
 * Example:
 * (async () => {
 *     await wait(4000).then(() => {
 *         console.log(new Date().toLocaleTimeString());
 *     }).then(() => {
 *         console.log('here');
 *     });
 * })();
 *
 * @param {number} ms Milliseconds to wait.
 * @param {boolean} [synchronous=false] Wait synchronously.
 */
export async function wait(ms: number, synchronous: boolean = false) {
    var _wait = (ms: number, synchronous: boolean) => {
        if (synchronous) {
            var start = Date.now();
            var now = start;

            while (now - start < ms)
                now = Date.now();
        } else {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    }

    await _wait(ms, synchronous);
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {Function} debounced function.
 */
export function debounce(func: Function, wait: number, immediate: boolean = false): Function {
    var timeout: any;

    return function() {
        var context = _global;
        var args = arguments;

        var later = function() {
            timeout = null;

            if (!immediate)
                func.apply(context, args);
        }

        var callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow)
            func.apply(context, args);
    }
}

export function pp(obj: any, space: number = 4) {
    console.log(pformat(obj));
}

export function pformat(obj: any, space: number = 4) {
    return JSON.stringifyEx(obj, space);
}

export function isEncoded(uri: string) {
    uri = uri || '';

    return uri !== decodeURIComponent(uri);
}

export function fullyDecodeURI(uri: string) {
    while (isEncoded(uri))
        uri = decodeURIComponent(uri);

    return uri;
}

export function keySort(keys: string[], desc: boolean = false) {
    return function(a: any, b: any) {
        let aVal: any = null;
        let bVal: any = null;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i == 0) {
                aVal = a[key]
                bVal = b[key]
            } else {
                aVal = aVal[key]
                bVal = bVal[key]
            }
        }

        return desc ? ~~(aVal < bVal) : ~~(aVal > bVal);
    }
}

export function sortAscending(a: any, b: any) {
    if (typeof a == 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }

    if (a < b)
        return -1;
    else if (a > b)
        return 1;
    else
        return 0;
}

export function sortDescending(a: any, b: any) {
    if (typeof a == 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }

    if (a > b)
        return -1;
    else if (a < b)
        return 1;
    else
        return 0;
}

export function printTable(rows: any[], includeIndex: boolean = true) {
    let longestWordLength = 0;
    var columnLengths = []

    if (includeIndex) {
        for (let i = 0; i < rows.length; i++) {
            var row = rows[i];

            if (i == 0)
                row.unshift('');
            else
                row.unshift(i - 1);
        }
    }

    for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (let i = 0; i < row.length; i++) {
            var column = row[i];
            var currentWordLength = column.toString().length;

            if (typeof columnLengths[i] === 'undefined') {
                columnLengths[i] = currentWordLength;
            } else {
                if (currentWordLength > columnLengths[i])
                    columnLengths[i] = currentWordLength;
            }
        }
    }

    let newLinesList = [];

    for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        var newLine = '';
        let formatPatterns = [];

        if (i == 0) {
            for (let i = 0; i < rows[0].length; i++)
                formatPatterns.push('{' + i + ', ~' + columnLengths[i] + '}');

            var formatPattern: string = formatPatterns.join(' | ');

            newLine = '| ' + formatPattern.format(...row) + ' |';
            newLinesList.push('='.repeat(newLine.length));
            newLinesList.push(newLine);
            newLinesList.push('='.repeat(newLine.length));
        } else {
            for (let i = 0; i < rows[0].length; i++)
                formatPatterns.push('{' + i + ', -' + columnLengths[i] + '}');

            var formatPattern: string = formatPatterns.join(' | ');

            newLine = '| ' + formatPattern.format(...row) + ' |';
            newLinesList.push(newLine);

            if (i == rows.length - 1)
                newLinesList.push('='.repeat(newLine.length));
        }
    }

    console.log(newLinesList.join('\n'));
}
