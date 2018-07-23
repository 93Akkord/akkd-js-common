"use strict";
// import 'core-js/core/'
Object.defineProperty(exports, "__esModule", { value: true });
require("./builtinPrototypes/stringPrototypes");
require("./builtinPrototypes/arrayPrototypes");
require("./classes/text/StringBuilder");
const _global = (typeof window !== 'undefined') ? window : global;
_global.pp = pp;
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
function merge(target, ...args) {
    for (var i = 1; i < arguments.length; ++i) {
        var from = arguments[i];
        if (typeof from !== 'object')
            continue;
        for (var j in from) {
            if (from.hasOwnProperty(j))
                target[j] = typeof from[j] === 'object' ? merge({}, target[j], from[j]) : from[j];
        }
    }
    return target;
}
exports.merge = merge;
function isNode() {
    if (typeof process === 'object' && process + '' === '[object process]')
        return true;
    else
        return false;
}
exports.isNode = isNode;
function getType(obj) {
    var typeVar = (function (global) {
        var cache = {};
        return function (obj) {
            var key;
            return obj === null ? 'null' // null
                :
                    obj === global ? 'global' // window in browser or global in nodejs
                        :
                            (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
                                :
                                    obj.nodeType ? 'object' // DOM element
                                        :
                                            cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
                                                ||
                                                    (cache[key] = key.slice(8, -1)); // get XXXX from [object XXXX], and cache it
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
function getObjectProperties(obj, filterBy, copyStr2Clipboard = false) {
    var allProps = {};
    var curr = obj;
    var tabStr = ' '.repeat(3);
    var level = 0;
    var sb = new StringBuilder();
    var levelIndicatorStr = '_';
    var re1 = new RegExp('\\s', 'g');
    var re2 = new RegExp(levelIndicatorStr, 'g');
    var re3 = new RegExp(levelIndicatorStr + '$');
    var add = true;
    var funcArray = [Object.getOwnPropertyNames, Object.getOwnPropertySymbols];
    do {
        for (let i = 0; i < funcArray.length; i++) {
            const func = funcArray[i];
            var props = func(curr);
            props.forEach(function (prop, index, array) {
                if (filterBy != null) {
                    if (getType(filterBy) == 'Array') {
                        for (let i = 0; i < filterBy.length; i++) {
                            const filterByItem = filterBy[i];
                            if (prop.contains(filterByItem, true)) {
                                add = true;
                                break;
                            }
                            else {
                                add = false;
                            }
                        }
                    }
                    else if (getType(filterBy) == 'string') {
                        if (prop.contains(filterBy, true))
                            add = true;
                        else
                            add = false;
                    }
                    else {
                        add = true;
                    }
                }
                else {
                    add = true;
                }
                if (add) {
                    if (allProps[prop] == null)
                        allProps[prop] = obj[prop];
                    if (copyStr2Clipboard) {
                        var val = typeof (obj[prop]) == 'function' ? '[function]' : obj[prop];
                        val = typeof (val) == 'object' ? JSON.stringifyEx(val) : val;
                        if (index === array.length - 1)
                            tabStr = tabStr.replace(re1, levelIndicatorStr);
                        sb.appendLine(removeAllButLastStrPattern(tabStr.repeat(level).replace(/\|$/, ''), '|').replace(re3, ' ') + ' ' + prop + ':  ' + val);
                        if (tabStr.indexOf(levelIndicatorStr) > -1)
                            tabStr = tabStr.replace(re2, ' ');
                    }
                }
            });
        }
        level++;
        if (copyStr2Clipboard && level > 1) {
            tabStr = tabStr.replace(/\|/g, '');
            tabStr = tabStr + '|';
        }
    } while (curr = Object.getPrototypeOf(curr));
    if (copyStr2Clipboard)
        _global.copy(sb.toString());
    return allProps;
}
exports.getObjectProperties = getObjectProperties;
function getUserDefinedGlobalVars() {
    var results;
    var currentWindow; // create an iframe and append to body to load a clean window object
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // get the current list of properties on window
    currentWindow = Object.getOwnPropertyNames(_global);
    // filter the list against the properties that exist in the clean window
    results = currentWindow.filter(function (prop) {
        return (iframe.contentWindow != null) ? !iframe.contentWindow.hasOwnProperty(prop) : false;
    });
    var tempObj = {};
    for (let index = 0; index < results.length; index++) {
        const propName = results[index];
        tempObj[propName] = _global[propName];
    }
    document.body.removeChild(iframe);
    return tempObj;
}
exports.getUserDefinedGlobalVars = getUserDefinedGlobalVars;
function printPropsNew(obj) {
    var headerFooterBanner = '=========================================================';
    console.log(headerFooterBanner);
    function _printProps(obj) {
        for (var key in obj) {
            // console.log('type:', getType([obj[key]]));
            if (getType([obj[key]]) == 'Object') {
                _printProps([obj[key]]);
            }
            else if (getType([obj[key]]) == 'Array') {
                console.log(key + ': ', JSON.stringifyEx([obj[key]]));
            }
            else {
                console.log(key + ': ', [obj[key]]);
            }
        }
    }
    _printProps(obj);
    console.log(headerFooterBanner);
}
exports.printPropsNew = printPropsNew;
function printProps(obj) {
    var headerFooterBanner = '=========================================================';
    console.log(headerFooterBanner);
    function _printProps(obj) {
        for (var key in obj) {
            console.log(key + ': ', [obj[key]]);
        }
    }
    _printProps(obj);
    console.log(headerFooterBanner);
}
exports.printProps = printProps;
function sortObject(o, desc = false) {
    var sorted = {};
    var key;
    var a = [];
    for (key in o) {
        if (o.hasOwnProperty(key))
            a.push(key);
    }
    if (desc)
        a.sort(sortDescending);
    else
        a.sort(sortAscending);
    for (key = 0; key < a.length; key++)
        sorted[a[key]] = o[a[key]];
    return sorted;
}
exports.sortObject = sortObject;
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
function isEncoded(uri) {
    uri = uri || '';
    return uri !== decodeURIComponent(uri);
}
exports.isEncoded = isEncoded;
/**
 * Get difference in days between two dates.
 *
 * @param {Date} dt1
 * @param {Date} dt2
 * @returns
 */
function dateDiffInDays(dt1, dt2) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
    var utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
exports.dateDiffInDays = dateDiffInDays;
function pp(obj, space = 4) {
    console.log(pformat(obj));
}
exports.pp = pp;
function pformat(obj, space = 4) {
    return JSON.stringify(obj, null, space);
}
exports.pformat = pformat;
function fullyDecodeURI(uri) {
    while (isEncoded(uri))
        uri = decodeURIComponent(uri);
    return uri;
}
exports.fullyDecodeURI = fullyDecodeURI;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomInt = randomInt;
function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}
exports.randomFloat = randomFloat;
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
async function measure(funcs, times = 10, millisecLength = 3, useDate = true) {
    funcs = (getType(funcs) == 'function') ? [funcs] : funcs;
    for (let i = 0; i < funcs.length; i++) {
        funcs[i] = (getType(funcs[i]) == 'function') ? { function: funcs[i] } : funcs[i];
    }
    var totals = [];
    var _hrtimeDurationToMilliseconds = function (hrtime) {
        return ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
    };
    var _convertMillisecondsToDigitalClock = function (ms, roundTo) {
        var pad = function (num, size) { return ('000' + num).slice(size * -1); };
        var milliseconds = ms % 1000;
        var seconds = parseInt((ms / 1000).toString().split('.')[0]);
        var minutes = seconds / 60;
        var hours = minutes / 60;
        minutes = parseInt((minutes / 60).toString().split('.')[0]);
        hours = parseInt((hours / 60).toString().split('.')[0]);
        var timestamp = {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds,
            clock: pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + Math.round(milliseconds).toString().padLeft('0', roundTo).padEnd(roundTo, '0').substr(0, roundTo)
        };
        var a = [];
        // a.includes
        return timestamp['clock'];
    };
    var _getTitleLength = function (funcs) {
        var titleLength = '    Function     '.length;
        funcs.forEach((func) => {
            var functionName = (func.function.name == '') ? '[anonymous]' : func.function.name;
            var title = '[' + functionName + ']';
            if (title.length > titleLength)
                titleLength = title.length;
        });
        return titleLength;
    };
    var titleLength = _getTitleLength(funcs);
    console.log('Testing execution times (standard error)', times, 'runs');
    var colPatternTitle = '{0, -4}{1, ~' + titleLength.toString() + '} | {2, ~17} | {3, ~17} | {4, ~17} | {5, ~17}';
    var colPattern = '{0, -4}{1, -' + (titleLength).toString() + '} | {2, ~17} | {3, ~17} | {4, ~17} | {5, ~17}';
    let results = [];
    await funcs.forEachAsyncParallel(async (func) => {
        var executionTimes = [];
        var functionName = (func.function.name == '') ? '[anonymous]' : func.function.name;
        var title = '[' + functionName + ']';
        for (var i = 0; i < times; i++) {
            var start = (useDate) ? Date.now() : performance.now();
            (func.args == undefined) ? await func.function() : await func.function(...func.args);
            var end = (useDate) ? Date.now() : performance.now();
            var executionTime = end - start;
            executionTimes.push(executionTime);
        }
        var min = _convertMillisecondsToDigitalClock(Math.min.apply(Math, executionTimes.map(function (val) { return val; })), millisecLength);
        var max = _convertMillisecondsToDigitalClock(Math.max.apply(Math, executionTimes.map(function (val) { return val; })), millisecLength);
        var total_raw = executionTimes.reduce((a, b) => a + b);
        var total = _convertMillisecondsToDigitalClock(total_raw, millisecLength);
        var avg_raw = total_raw / executionTimes.length;
        var avg = _convertMillisecondsToDigitalClock(avg_raw, millisecLength);
        results.push({
            title: title,
            min: min,
            max: max,
            avg: avg,
            avg_raw: avg_raw,
            total: total,
            total_raw: total_raw
        });
        totals.push(executionTimes.reduce(function (a, b) { return a + b; }, 0));
    });
    results.sort(keySort(['avg_raw'], false));
    // Print stats
    console.log(colPatternTitle.format('', 'Function', 'Total', 'Min', 'Max', 'Avg'));
    for (let i = 0; i < results.length; i++)
        console.log(colPattern.format((i + 1) + '.', results[i].title, results[i].total, results[i].min, results[i].max, results[i].avg));
    if (results.length > 1)
        console.log('{0} is {1} faster than {2}.\n'.format(results[0].title, ((results[1].avg_raw - results[0].avg_raw) / results[0].avg_raw).toFixed(2), results[1].title));
}
exports.measure = measure;
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
// // we must force tsc to interpret this file as a module, resolves
// // "Augmentations for the global scope can only be directly nested in external modules or ambient module declarations."
// // error
// export { }
// declare global {
//     function testGlobal<T>(someObject: T | null | undefined, defaultValue?: T | null | undefined): T;
//     function merge(target: any, ...args: any[]): any;
// }
// const _global = (typeof window !== 'undefined') ? window : global as any;
// _global.testGlobal = function <T>(object: T | null | undefined, defaultValue: T | null = null): T {
//     if (typeof object === 'undefined' || object === null)
//         return defaultValue as T;
//     else
//         return object;
// }
// _global.merge = merge;
