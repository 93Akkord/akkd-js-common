// // we must force tsc to interpret this file as a module, resolves
// // "Augmentations for the global scope can only be directly nested in external modules or ambient module declarations."
// // error
// export { }
Object.defineProperty(exports, "__esModule", { value: true });
require("../builtinPrototypes/stringPrototypes");
require("../builtinPrototypes/arrayPrototypes");
require("../builtinPrototypes/jsonPrototypes");
require("../classes/text/StringBuilder");
const objectHelpers_1 = require("./objectHelpers");
exports.merge = objectHelpers_1.merge;
exports.getObjectProperties = objectHelpers_1.getObjectProperties;
exports.getUserDefinedGlobalVars = objectHelpers_1.getUserDefinedGlobalVars;
exports.sortObject = objectHelpers_1.sortObject;
exports.printProps = objectHelpers_1.printProps;
exports.printPropsNew = objectHelpers_1.printPropsNew;
const dateHelpers_1 = require("./dateHelpers");
exports.dateDiffInDays = dateHelpers_1.dateDiffInDays;
const _global = (typeof window !== 'undefined') ? window : global;
_global.pp = pp;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomInt = randomInt;
function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}
exports.randomFloat = randomFloat;
function equals(x, y) {
    if (x === y)
        return true;
    // if both x and y are null or undefined and exactly the same
    if (!(x instanceof Object) || !(y instanceof Object))
        return false;
    // if they are not strictly equal, they both need to be Objects
    if (x.constructor !== y.constructor)
        return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    for (var p in x) {
        if (!x.hasOwnProperty(p))
            continue;
        // other properties were tested using x.constructor === y.constructor
        if (!y.hasOwnProperty(p))
            return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (x[p] === y[p])
            continue;
        // if they have the same strict value or identity then they are equal
        if (typeof (x[p]) !== "object")
            return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (!equals(x[p], y[p]))
            return false;
        // Objects and Arrays must be tested recursively
    }
    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
            return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}
exports.equals = equals;
function isNode() {
    if (typeof process === 'object' && process + '' === '[object process]')
        return true;
    else
        return false;
}
exports.isNode = isNode;
function getType(obj, getInherited = false) {
    var typeVar = (function (global) {
        var cache = {};
        return function (obj) {
            var key;
            if (obj == null) {
                // null
                return 'null';
            }
            else {
                if (obj == global) {
                    // window in browser or global in nodejs
                    return 'global';
                }
                else {
                    if ((key = typeof obj) !== 'object') {
                        // basic: string, boolean, number, undefined, function
                        return key;
                    }
                    else {
                        if (obj.nodeType) {
                            'object'; // DOM element
                            return 'object';
                        }
                        else {
                            if (obj.constructor != undefined && obj.constructor.name != 'Object' && !getInherited) {
                                return obj.constructor.name;
                            }
                            else {
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
exports.getType = getType;
function removeAllButLastStrPattern(str, token) {
    var parts = str.split(token);
    if (parts[1] === undefined)
        return str;
    else
        return parts.slice(0, -1).join('') + token + parts.slice(-1);
}
exports.removeAllButLastStrPattern = removeAllButLastStrPattern;
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
async function wait(ms, synchronous = false) {
    var _wait = (ms, synchronous) => {
        if (synchronous) {
            var start = Date.now();
            var now = start;
            while (now - start < ms)
                now = Date.now();
        }
        else {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    };
    await _wait(ms, synchronous);
}
exports.wait = wait;
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
function debounce(func, wait, immediate = false) {
    var timeout;
    return function () {
        var context = _global;
        var args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
exports.debounce = debounce;
function pp(obj, space = 4) {
    console.log(pformat(obj));
}
exports.pp = pp;
function pformat(obj, space = 4) {
    return JSON.stringifyEx(obj, space);
}
exports.pformat = pformat;
function isEncoded(uri) {
    uri = uri || '';
    return uri !== decodeURIComponent(uri);
}
exports.isEncoded = isEncoded;
function fullyDecodeURI(uri) {
    while (isEncoded(uri))
        uri = decodeURIComponent(uri);
    return uri;
}
exports.fullyDecodeURI = fullyDecodeURI;
function keySort(keys, desc = false) {
    return function (a, b) {
        let aVal = null;
        let bVal = null;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i == 0) {
                aVal = a[key];
                bVal = b[key];
            }
            else {
                aVal = aVal[key];
                bVal = bVal[key];
            }
        }
        return desc ? ~~(aVal < bVal) : ~~(aVal > bVal);
    };
}
exports.keySort = keySort;
function sortAscending(a, b) {
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
exports.sortAscending = sortAscending;
function sortDescending(a, b) {
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
exports.sortDescending = sortDescending;
function printTable(rows, includeIndex = true) {
    let longestWordLength = 0;
    var columnLengths = [];
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
            }
            else {
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
            var formatPattern = formatPatterns.join(' | ');
            newLine = '| ' + formatPattern.format(...row) + ' |';
            newLinesList.push('='.repeat(newLine.length));
            newLinesList.push(newLine);
            newLinesList.push('='.repeat(newLine.length));
        }
        else {
            for (let i = 0; i < rows[0].length; i++)
                formatPatterns.push('{' + i + ', -' + columnLengths[i] + '}');
            var formatPattern = formatPatterns.join(' | ');
            newLine = '| ' + formatPattern.format(...row) + ' |';
            newLinesList.push(newLine);
            if (i == rows.length - 1)
                newLinesList.push('='.repeat(newLine.length));
        }
    }
    console.log(newLinesList.join('\n'));
}
exports.printTable = printTable;
