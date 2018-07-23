(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.akkd = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
Array.prototype.clear = function () {
    this.length = 0;
};
Array.prototype.pushUnique = function (...items) {
    var index = -1;
    items.forEach(item => {
        for (var i = 0; i < this.length; i++) {
            if (helpers_1.equals(this[i], item))
                index = i;
        }
        if (index === -1)
            this.push(item);
    });
    return this.length;
};
Array.prototype.distinct = function (inPlace = false) {
    var seen = {};
    var retArr = [];
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
    }
    else {
        for (var i = 0; i < this.length; i++) {
            if (!(this[i] in seen)) {
                retArr.push(this[i]);
                seen[this[i]] = true;
            }
        }
        return retArr;
    }
};
Array.prototype.getPartialMatches = function (compare, caseSensitive) {
    var tempArray = [];
    if (caseSensitive == null)
        caseSensitive = true;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (!caseSensitive) {
            if (element.toLowerCase().includes(compare.toLowerCase()))
                tempArray.push(element);
        }
        else {
            if (element.includes(compare))
                tempArray.push(element);
        }
    }
    return tempArray;
};
Array.prototype.containsPartial = function (compare, caseSensitive) {
    var tempArray = [];
    if (caseSensitive == null)
        caseSensitive = true;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (!caseSensitive) {
            if (element.toLowerCase().includes(compare.toLowerCase()))
                tempArray.push(element);
        }
        else {
            if (element.includes(compare))
                tempArray.push(element);
        }
    }
    return (tempArray.length > 0) ? true : false;
};
Array.prototype.containsPartialArray = function (compareArray) {
    var tempArray = [];
    for (let i = 0; i < compareArray.length; i++) {
        const element = compareArray[i];
        tempArray.push.apply(tempArray, this.filter(function (item) {
            var finder = element;
            var result = eval('/' + finder + '/i').test(item);
            return result;
        }));
    }
    return tempArray.distinct(false);
};
Array.prototype.forEachAsync = async function (func) {
    for (let t of this)
        var result = await func(t);
};
Array.prototype.forEachAsyncParallel = async function (func) {
    await Promise.all(this.map(func));
};
Array.prototype.sliceArgs = function () {
    var a = [];
    for (let i = 0; i < arguments[0].length; i++)
        a.push(arguments[0][i]);
    return a;
};

},{"../helpers/helpers":9}],3:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
if (!helpers_1.isNode()) {
    console.save = function (data, filename) {
        if (!data) {
            console.error('Console.save: No data');
            return;
        }
        if (!filename)
            filename = 'console.json';
        if (typeof data === "object")
            data = JSON.stringify(data, undefined, 4);
        var blob = new Blob([data], {
            type: 'text/json'
        }), e = document.createEvent('MouseEvents'), a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    };
}

},{"../helpers/helpers":9}],4:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
const StringBuilder_1 = require("../classes/text/StringBuilder");
JSON.stringifyEx = function (obj, spaces = 4, maxLevel = 0, includeFunctionBodies = false, includeFunctions = true) {
    var indentStr = ' '.repeat(spaces);
    var newLineChar = (spaces == 0) ? ' ' : '\n';
    function _stringifyEx(obj, indentLevel = 0, parent) {
        var sb = new StringBuilder_1.StringBuilder();
        var objType = helpers_1.getType(obj, true);
        var openBracket = (['Object', 'process', 'global'].includes(objType)) ? '{' : '[';
        var closeBracket = (['Object', 'process', 'global'].includes(objType)) ? '}' : ']';
        var formatPattern = (['Object', 'process', 'global'].includes(objType)) ? '{0}"{1}": {2},' : '{0}{1},';
        sb.append(openBracket).append(newLineChar);
        for (var [key, value] of Object.entries(obj)) {
            var valueType = helpers_1.getType(value, true);
            var indent = indentStr.repeat(indentLevel + 1);
            switch (valueType) {
                case 'Object':
                case 'Array':
                case 'global':
                case 'process':
                    if (maxLevel == 0 || indentLevel < maxLevel) {
                        if (parent && helpers_1.equals(parent, obj)) {
                            return '"[circular reference]"';
                        }
                        else {
                            if (['Object', 'process', 'global'].includes(objType))
                                sb.append(formatPattern, indent, key, _stringifyEx(value, indentLevel + 1, obj)).append(newLineChar);
                            else if (objType == 'Array')
                                sb.append(formatPattern, indent, _stringifyEx(value, indentLevel + 1, obj)).append(newLineChar);
                        }
                    }
                    break;
                default:
                    if (valueType === 'symbol') {
                        // value = (getType(value) == 'symbol') ? `$$Symbol:${Symbol.keyFor((value as symbol))}` : value;
                        // value = (getType(value) == 'symbol') ? `$$Symbol:${Symbol.keyFor(value)}` : value;
                        value = `$$Symbol:${value.toString()}`;
                    }
                    if (valueType === 'function') {
                        if (includeFunctions) {
                            value = (includeFunctionBodies) ? value.toString() : createdTruncatedFunctionSignature(value.toString().replace(/\r/g, '').split('\n')[0]);
                            if (value.contains('native code')) { /* console.log('key: {0} - [native code] - parent: {1} - functionStr: {2}'.format(key, getType(obj), parentKey + '.' + key)); */ }
                        }
                        else {
                            continue;
                        }
                    }
                    if (['Object', 'process', 'global'].includes(objType))
                        sb.append(formatPattern, indent, key, (['number', 'boolean', 'null'].includes(helpers_1.getType(value))) ? value : '{0}'.format(JSON.stringify(value.toString()))).append(newLineChar);
                    else if (objType == 'Array')
                        sb.append(formatPattern, indent, (['number', 'boolean', 'null'].includes(helpers_1.getType(value))) ? value : '"{0}"'.format(JSON.stringify(value.toString()))).append(newLineChar);
                    break;
            }
        }
        sb.append(indentStr.repeat(indentLevel) + closeBracket);
        return sb.toString().replaceLast(',', '');
    }
    return _stringifyEx(obj);
};
JSON.parseEx = function (text, reviver) {
    if (reviver == null) {
        return JSON.parse(text, (k, v) => {
            if (typeof v === 'string' && (v.indexOf('function') >= 0 || /^(\(|).+(\(|) => {/.test(v)))
                return (v.indexOf('function') == 0) ? eval('(' + v + ')') : eval(v);
            const symbolMatches = v.match && v.match(/^\$\$Symbol:(.*)$/);
            return symbolMatches ? Symbol.for(symbolMatches[1]) : v;
            // return v;
        });
    }
    return JSON.parse(text, reviver);
};
function createdTruncatedFunctionSignature(funcStr) {
    var re = /^((.*?)(\()(.*)(\))|([a-zA-Z].*?)\s).+/;
    return funcStr.replace(re, function (...args) {
        var results = {
            originalStr: args.pop(),
            offset: args.pop(),
            match: args.shift(),
            groups: args
        };
        // console.log(JSON.stringify(results.groups, null, 4));
        var argsStr = '';
        var argsIndex = 0;
        var prefixIndex = '';
        if (results.originalStr.substring(0, 8) == 'function') {
            argsIndex = 3;
            prefixIndex = results.groups[1];
        }
        else if (results.groups[1] == null) {
            argsIndex = 5;
        }
        else {
            argsIndex = 3;
        }
        var argsStr = '(' + results.groups[argsIndex].split([',', ', ']).join(', ') + ')';
        if (results.originalStr.indexOf('function') == 0)
            return prefixIndex + argsStr + ' {}';
        else
            return prefixIndex + argsStr + ' => {}';
    });
}

},{"../classes/text/StringBuilder":7,"../helpers/helpers":9}],5:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
String.prototype.format = function (...args) {
    return this.replace(/{((\d+)|(\d+),((\s+?|.?)(-?|.?)\d+))}/g, function (match, number, match2, number2) {
        if (match2 == undefined) {
            var pad = number.split(',')[1].trim();
            var padNumber = parseInt(pad.replace(/-|~/g, ''));
            var replaceWith = args[number2].toString();
            var diff = padNumber - replaceWith.length;
            diff = (diff > -1) ? diff : 0;
            if (pad.indexOf('-') > -1) {
                return replaceWith + ' '.repeat(diff);
            }
            else if (pad.indexOf('~') > -1) {
                let s = replaceWith + ' '.repeat(diff);
                let re1 = s.match(/^\s*/);
                let re2 = s.match(/.+[^\s](\s*)/);
                let spacesCount1 = (re1 != null) ? re1[0].length : 0;
                let spacesCount2 = (re2 != null && re2.length > 1) ? re2[1].length : 0;
                let spacesCount = spacesCount1 + spacesCount2;
                return ' '.repeat(Math.floor(spacesCount / 2)) + s.trim() + ' '.repeat(Math.ceil(spacesCount / 2));
            }
            else {
                return ' '.repeat(diff) + replaceWith;
            }
        }
        else if (match2 != undefined) {
            return args[match2];
        }
    });
};
String.prototype.contains = function (s, caseSensitive = false) {
    if (caseSensitive)
        return this.toLowerCase().indexOf(s.toLowerCase()) != -1;
    else
        return this.indexOf(s) != -1;
};
String.prototype.padLeft = function (char, length) {
    return char.repeat(Math.max(0, length - this.length)) + this;
};
String.prototype.padRight = function (char, length) {
    return this.substring(0, length) + char.repeat(Math.max(0, length - this.substring(0, length).length));
};
String.prototype.toTitleCase = function () {
    var i;
    var j;
    var str;
    var lowers;
    var uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function (txt) {
            return txt.toLowerCase();
        });
    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());
    return str;
};
String.prototype.replaceLast = function (what, replacement) {
    return this.split(' ').reverse().join(' ').replace(new RegExp(what), replacement).split(' ').reverse().join(' ');
};

},{}],6:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", { value: true });
const _global = (typeof window !== 'undefined') ? window : global;
class Enum {
    constructor(...args) {
        for (var i in arguments) {
            this[args[i]] = arguments[i];
        }
    }
    toString() {
        let tempArray = [];
        Object.keys(this).forEach(key => {
            var value = this[key];
            if ((value instanceof Function) == false)
                tempArray.push(value);
        });
        return tempArray;
    }
}
exports.Enum = Enum;
_global.Enum = function (...args) {
    return new Enum(...args);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", { value: true });
require("../../builtinPrototypes/stringPrototypes");
const helpers_1 = require("../../helpers/helpers");
const _global = (typeof window !== 'undefined') ? window : global;
class StringBuilder extends Array {
    constructor() {
        super(...arguments);
        this.id = helpers_1.randomInt(1000, 9999);
    }
    append(str, ...args) {
        if (args.length == 0)
            this.push(str);
        else
            this.push(str.format(...args));
        return this;
    }
    appendLine(str, ...args) {
        if (args.length == 0)
            return this.append(str + '\n');
        else
            return this.append(str.format(...args) + '\n');
    }
    toString() {
        return this.join('');
    }
    clear() {
        this.length = 0;
    }
}
exports.StringBuilder = StringBuilder;
_global.StringBuilder = StringBuilder;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../builtinPrototypes/stringPrototypes":5,"../../helpers/helpers":9}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
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

},{}],9:[function(require,module,exports){
(function (process,global){
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

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../builtinPrototypes/arrayPrototypes":2,"../builtinPrototypes/jsonPrototypes":4,"../builtinPrototypes/stringPrototypes":5,"../classes/text/StringBuilder":7,"./dateHelpers":8,"./objectHelpers":10,"_process":1}],10:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const _global = (typeof window !== 'undefined') ? window : global;
function merge(target, ...args) {
    return Object.assign(target, ...args);
}
exports.merge = merge;
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
                    if (helpers_1.getType(filterBy) == 'Array') {
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
                    else if (helpers_1.getType(filterBy) == 'string') {
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
                        sb.appendLine(helpers_1.removeAllButLastStrPattern(tabStr.repeat(level).replace(/\|$/, ''), '|').replace(re3, ' ') + ' ' + prop + ':  ' + val);
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
function sortObject(o, desc = false) {
    var sorted = {};
    var key;
    var a = [];
    for (key in o) {
        if (o.hasOwnProperty(key))
            a.push(key);
    }
    if (desc)
        a.sort(helpers_1.sortDescending);
    else
        a.sort(helpers_1.sortAscending);
    for (key = 0; key < a.length; key++)
        sorted[a[key]] = o[a[key]];
    return sorted;
}
exports.sortObject = sortObject;
function printPropsNew(obj) {
    var headerFooterBanner = '=========================================================';
    console.log(headerFooterBanner);
    function _printProps(obj) {
        for (var key in obj) {
            // console.log('type:', getType([obj[key]]));
            if (helpers_1.getType([obj[key]]) == 'Object') {
                _printProps([obj[key]]);
            }
            else if (helpers_1.getType([obj[key]]) == 'Array') {
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./helpers":9}],11:[function(require,module,exports){
// tsc && browserify dist/index.js --standalone akkd > dist_bundle/bundle.js && node dist_bundle/bundle.js
Object.defineProperty(exports, "__esModule", { value: true });
require("./builtinPrototypes/arrayPrototypes");
require("./builtinPrototypes/jsonPrototypes");
require("./builtinPrototypes/stringPrototypes");
require("./builtinPrototypes/consolePrototypes");
// import './builtinPrototypes/elementPrototypes';
// import { ListenerTracker } from './builtinPrototypes/elementPrototypes';
require("./classes/text/StringBuilder");
require("./classes/Enum");
require("./helpers/helpers");
const helpers_1 = require("./helpers/helpers");
console.log(helpers_1.getType('s'));
// (async function () {
//     const _global = (typeof window !== 'undefined') ? window : global as any;
//     console.clear();
//     var obj: any = {
//         firstName: 'Michael',
//         lastName: 'Barros',
//         homeAddress: {
//             street: '11728 NW 26 CT',
//             city: 'Coral Springs',
//             get homeAddress(): any {
//                 return this;
//             }
//         },
//         getAge: function(birthYear: number, currentYear: number) {
//             return currentYear - birthYear;
//         },
//         getYearBorn: (age: number, currentYear: number) => {
//             return currentYear - age;
//         },
//     }
//     class Circular {
//         value: string;
//         self: Circular;
//         person: any;
//         constructor() {
//             this.value = 'Hello World';
//             this.self = this;
//             this.person = obj;
//         }
//     }
//     var circular = new Circular();
//     var list = [
//         1,
//         2,
//         3,
//         obj,
//         circular
//     ];
//     var o = {
//         person: obj,
//         list: list,
//         circular: circular,
//         sb: (new StringBuilder).constructor.name,
//         date: new Date(),
//         number: 1
//     }
//     function testObjectTypes() {
//         var objList = [
//             new Date(),
//             1,
//             's',
//             new StringBuilder(),
//             JSON,
//             {},
//             []
//         ]
//         objList.forEach(obj => {
//             console.log('value: {0}'.format(obj));
//             console.log('getType: {0}'.format(getType(obj)));
//             console.log('toString: {0}'.format(({}).toString.call(obj)));
//             console.log('typeof: {0}'.format(typeof(obj)));
//             console.log('constructor: {0}'.format(obj.constructor.name));
//             console.log('');
//         });
//     }
//     function testWrapper(func: any) {
//         var header = '================== ' + arguments.callee.caller.name + ' ==================';
//         console.log(header);
//         func();
//         console.log('='.repeat(header.length) + '\n\n');
//     }
//     function test01() {
//         testWrapper(function test01() {
//             var obj1 = {
//                 a: Symbol.for('a'),
//                 add: function(x: any,y: any){
//                     var s1 = 'str1';
//                     var s2 = 'str2';
//                     // comments
//                     return x+y+'    '+s1+' '+s2;
//                 },
//                 substract: (x: any,y: any)=>x-y
//             }
//             var objs = [obj1];
//             objs.forEach(function(obj) {
//                 var saved_old = JSON.stringify(obj, (k,v) => typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v);
//                 var saved = JSON.stringifyEx(obj, 4, 0, true);
//                 // const restored = JSON.parse(saved, (k,v) => {
//                 //       const matches = v.match && v.match(/^\$\$Symbol:(.*)$/)
//                 //       return matches ? Symbol.for(matches[1]) : v
//                 // })
//                 // console.log('saved_old:', saved_old);
//                 console.log('  new_old:', saved);
//                 console.log('\n\n\n');
//                 // console.log('  before:', obj);
//                 var restored = JSON.parseEx(saved);
//                 console.log('restored:', restored);
//                 console.log(restored.add(5, 30));
//                 console.log(obj.substract(5, 30));
//                 console.log('');
//             })
//         });
//     }
//     function test02() {
//         testWrapper(function test01() {
//             // console.log(global);
//             var saved = JSON.stringifyEx(global, 4, 0, true, true);
//             console.log(saved);
//             // pp(global);
//             // console.log('toStringTag:', global['__core-js_shared__'].wks.toStringTag);
//             // console.log('asyncIterator:', global['__core-js_shared__'].wks.asyncIterator);
//             // console.log(global[global['__core-js_shared__'].wks.toStringTag]);
//             // console.log(global[global['__core-js_shared__'].wks.asyncIterator]);
//             // console.log(Object.getOwnPropertySymbols(global));
//             console.log('');
//             // var restored = JSON.parseEx(saved);
//             // console.log('restored:', restored);
//             // pp(global);
//             // test01();
//             // toStringTag: Symbol(Symbol.toStringTag),
//             // a: Symbol(a)
//         });
//     }
//     var rows = [
//         ['first_name', 'last_name', 'days'],
//         ['michael', 'johnson johnson', 525],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//     ]
//     printTable(rows, true);
//     // test01();
//     // test02();
// })().then().catch(err => console.log(err));

},{"./builtinPrototypes/arrayPrototypes":2,"./builtinPrototypes/consolePrototypes":3,"./builtinPrototypes/jsonPrototypes":4,"./builtinPrototypes/stringPrototypes":5,"./classes/Enum":6,"./classes/text/StringBuilder":7,"./helpers/helpers":9}]},{},[11])(11)
});
