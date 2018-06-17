// var akkdCommon = {
//     numberFormat: function(number, locale) {
//         return number.toLocaleString(locale);
//     }
// }

// module.exports = akkdCommon;

'use strict';

var devTag = '[Akkd]';

// search: ^function\s+([a-zA-Z0-9_]+)(\s+|)(\((.+|)\))\s+
// replace: $1 = $3 =>

// var windowVar = null;

// if (GM_info != null && GM_info != undefined)
//     windowVar = unsafeWindow;
// else
//     windowVar = window;

//#region Helper Classes

function ConsoleEx_Old() {
    this.lines = [];
    this.currentLine = 0;

    this.log = function(msg, removeLastLine, appendToCurrentLine) {
        if (removeLastLine)
            this.lines.pop();

        if (!appendToCurrentLine)
            this.currentLine++;

        if (appendToCurrentLine && this.lines[this.currentLine])
            this.lines[this.currentLine] += msg;
        else
            this.lines[this.currentLine] = msg;

        console.clear();

        this.lines.forEach(function(line) {
            console.log(line);
        });
    }

    this.clear = function() {
        console.clear();
        consoleEx.currentLine = 0;
    }
}

var consoleEx = class consoleEx {
    static log() {
        var newArgs = [];

        for (let i = 0; i < arguments.length; i++) {
            const element = arguments[i];

            if (typeof(element) == 'object')
                newArgs.push(JSON.stringify(arguments[i], null, 4));
            else
                newArgs.push(element);
        }

        if (isNode())
            process.stdout.write([...newArgs].join(' ') + '\n');
        else
            console.log(...arguments);
    }
}

function StringBuilderEx() {
    // Using prototype I link function append to push
    Array.prototype.append = Array.prototype.push;

    Array.prototype.appendLine = function(s) {
        this.append(s + '\n');
    }

    Array.prototype.appendFormat = function(pattern) {
        var args = this._convertToArray(arguments).slice(1);
        this.append(pattern.toString().format(...args));
    }

    // Used to convert arguments in array
    Array.prototype._convertToArray = function(args) {
        if (!args)
            return new Array();

        if (args.toArray)
            return args.toArray();

        var len = args.length
        var results = new Array(len);

        while (len--) {
            results[len] = args[len];
        }

        return results;
    }

    // Concatenate the strings using join (some lines of code are relay with second solution)
    Array.prototype.toString = function() {
        var hasParameters = this._parameters != null;
        hasParameters = hasParameters && this._parameters.length > 0;

        if (hasParameters) {
            var values = this.join('').split('?');
            var tempBuffer = new Array();

            for (var t = 0, len = values.length; t < len; t++) {
                tempBuffer[tempBuffer.length] = values[t];
                tempBuffer[tempBuffer.length] = this._parameters[t];
            }

            return tempBuffer.join('');
        } else {
            return this.join('');
        }
    }

    Array.prototype.clear = function() {
        this.length = 0;
    }
}
StringBuilderEx.prototype = new Array;

function Enum() {
    class Enum {
        constructor() {
            for (var i in arguments) {
                this[arguments[i]] = arguments[i];
            }
        }

        toString() {
            let tempArray = [];
            for (const [key, value] of Object.entries(this)) {
                if ((value instanceof Function) == false)
                    tempArray.push(value);
            }

            return tempArray;
        }
    }

    return new Enum(...arguments)
}

var LogCapture = (function() {
    var oldLog = console.log;
    var sb = new StringBuilderEx();

    class LogCapture {
        constructor() {}

        log() {
            var newArgs = [];

            for (let i = 0; i < arguments.length; i++) {
                const element = arguments[i];

                if (typeof(element) == 'object')
                    newArgs.push(JSON.stringify(arguments[i], null, 4));
                else
                    newArgs.push(element);
            }

            var s = [...newArgs].join(' ');
            sb.appendLine(s);
        }

        start() {
            console.log = this.log;
        }

        end() {
            console.log = oldLog;
        }

        toString() {
            return sb.toString();
        }
    }

    return new LogCapture();
});

//#endregion Helper Classes

//#region Helper Functions

async function measure({
    funcs,
    times = 10,
    millisecLength = 3,
    useDate = false
} = {}) {
    times = times || 1;
    funcs = (type(funcs) == 'function') ? [funcs] : funcs;
    for (let i = 0; i < funcs.length; i++) { funcs[i] = (type(funcs[i]) == 'function') ? { function: funcs[i] } : funcs[i]; }
    var write = console.log;
    var totals = [];
    var millisecondLength = (millisecLength == null) ? 3 : millisecLength;

    var _hrtimeDurationToMilliseconds = function(hrtime) {
        return ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
    }

    var _convertMillisecondsToDigitalClock = function(ms, roundTo) {
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

        return timestamp['clock'];
    }

    var _getTitleLength = function(funcs) {
        var titleLength = '    Function     '.length;

        funcs.forEach(func => {
            var functionName = (func.function.name == '') ? '[anonymous]' : func.function.name;
            var title = '[' + functionName + ']';

            if (title.length > titleLength)
                titleLength = title.length;
        });

        return titleLength;
    }

    var titleLength = _getTitleLength(funcs);

    write('Testing execution times (standard error)', times, 'runs');
    var colPatternTitle = '{0, -4}{1, ~' + titleLength.toString() + '} | {2, ~17} | {3, ~17} | {4, ~17} | {5, ~17}';
    var colPattern = '{0, -4}{1, -' + (titleLength).toString() + '} | {2, ~17} | {3, ~17} | {4, ~17} | {5, ~17}';

    let results = [];

    await funcs.forEachAsync(async func => {
        var executionTimes = [];
        var functionName = (func.function.name == '') ? '[anonymous]' : func.function.name;
        var title = '[' + functionName + ']';

        // Use node.js timer functions
        if (isNode()) {
            (func.args == undefined) ? func.function(): func.function(...func.args);
            await wait(250);

            for (var i = 0; i < times; i++) {
                var start = (useDate) ? Date.now() : process.hrtime();

                (func.args == undefined) ? await func.function(): await func.function(...func.args);

                if (useDate)
                    var executionTime = Date.now() - start;
                else
                    var executionTime = _hrtimeDurationToMilliseconds(process.hrtime(start));

                executionTimes.push(executionTime);
            }
        } else {
            (func.args == undefined) ? func.function(): func.function(...func.args);
            await wait(250);

            for (var i = 0; i < times; i++) {
                var start = (useDate) ? Date.now() : performance.now();

                (func.args == undefined) ? func.function(): func.function(...func.args);

                if (useDate)
                    var end = Date.now();
                else
                    var end = performance.now();

                var executionTime = end - start;

                executionTimes.push(executionTime);
            }
        }

        var min = _convertMillisecondsToDigitalClock(Math.min.apply(Math, executionTimes.map(function(val) { return val; })), millisecondLength);
        var max = _convertMillisecondsToDigitalClock(Math.max.apply(Math, executionTimes.map(function(val) { return val; })), millisecondLength);

        var total_raw = executionTimes.reduce((a, b) => a + b);
        var total = _convertMillisecondsToDigitalClock(total_raw, millisecondLength);

        var avg_raw = total_raw / executionTimes.length;
        var avg = _convertMillisecondsToDigitalClock(avg_raw, millisecondLength);

        results.push({
            title: title,
            min: min,
            max: max,
            avg: avg,
            avg_raw: avg_raw,
            total: total,
            total_raw: total_raw
        });

        totals.push(executionTimes.reduce(function(a, b) { return a + b; }, 0));
    });

    results.sort(keySort(['avg_raw'], false));

    // Print stats
    write(colPatternTitle.format('', 'Function', 'Total', 'Min', 'Max', 'Avg'));
    for (let i = 0; i < results.length; i++)
        write(colPattern.format((i + 1) + '.', results[i].title, results[i].total, results[i].min, results[i].max, results[i].avg));

    if (results.length > 1)
        write('{0} is {1} faster than {2}.\n'.format(results[0].title, ((results[1].avg_raw - results[0].avg_raw) / results[0].avg_raw).toFixed(2), results[1].title));
}

function removeAllButLastStrPattern(string, token) {
    var parts = string.split(token);

    if (parts[1] === undefined)
        return string;
    else
        return parts.slice(0, -1).join('') + token + parts.slice(-1)
}

function getUserDefinedGlobalVars() {
    var results;
    var currentWindow; // create an iframe and append to body to load a clean window object
    var iframe = document.createElement('iframe');

    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // get the current list of properties on window
    currentWindow = Object.getOwnPropertyNames(window);
    // filter the list against the properties that exist in the clean window
    results = currentWindow.filter(function(prop) {
        return !iframe.contentWindow.hasOwnProperty(prop);
    });

    var tempObj = {};

    for (let index = 0; index < results.length; index++) {
        const propName = results[index];
        tempObj[propName] = window[propName];
    }

    document.body.removeChild(iframe);

    return tempObj;
}

function printProps(obj) {
    var headerFooterBanner = '=========================================================';

    console.log(headerFooterBanner);

    for (var key in obj)
        console.log(key + ': ', [obj[key]]);

    console.log(headerFooterBanner);
}

function sortObject(o, desc) {
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

function convertMillisecondsToDigitalClock(ms, roundTo) {
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
        clock: pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + padLeft(Math.round(milliseconds).toString(), '0', roundTo).padEnd(roundTo, '0').substr(0, roundTo)
    };

    return timestamp['clock'];
}

function isNode() {
    if (typeof process === 'object' && process + '' === '[object process]')
        return true;
    else
        return false;
}

function cssbeautify(style, opt) {
    var options, index = 0,
        length = style.length,
        blocks, formatted = '',
        ch, ch2, str, state, State, depth, quote, comment, openbracesuffix = true,
        autosemicolon = false,
        trimRight;

    options = arguments.length > 1 ? opt : {};
    if (typeof options.indent === 'undefined') {
        options.indent = '    ';
    }
    if (typeof options.openbrace === 'string') {
        openbracesuffix = (options.openbrace === 'end-of-line');
    }
    if (typeof options.autosemicolon === 'boolean') {
        autosemicolon = options.autosemicolon;
    }

    function isWhitespace(c) {
        return (c === ' ') || (c === '\n') || (c === '\t') || (c === '\r') || (c === '\f');
    }

    function isQuote(c) {
        return (c === '\'') || (c === '"');
    }

    // FIXME: handle Unicode characters
    function isName(c) {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || '-_*.:#[]'.indexOf(c) >= 0;
    }

    function appendIndent() {
        var i;
        for (i = depth; i > 0; i -= 1) {
            formatted += options.indent;
        }
    }

    function openBlock() {
        formatted = trimRight(formatted);
        if (openbracesuffix) {
            formatted += ' {';
        } else {
            formatted += '\n';
            appendIndent();
            formatted += '{';
        }
        if (ch2 !== '\n') {
            formatted += '\n';
        }
        depth += 1;
    }

    function closeBlock() {
        var last;
        depth -= 1;
        formatted = trimRight(formatted);

        if (formatted.length > 0 && autosemicolon) {
            last = formatted.charAt(formatted.length - 1);
            if (last !== ';' && last !== '{') {
                formatted += ';';
            }
        }

        formatted += '\n';
        appendIndent();
        formatted += '}';
        blocks.push(formatted);
        formatted = '';
    }

    if (String.prototype.trimRight) {
        trimRight = function(s) {
            return s.trimRight();
        };
    } else {
        // old Internet Explorer
        trimRight = function(s) {
            return s.replace(/\s+$/, '');
        };
    }

    var State = Enum('Start',
        'AtRule',
        'Block',
        'Selector',
        'Ruleset',
        'Property',
        'Separator',
        'Expression',
        'URL'
    );

    depth = 0;
    state = State.Start;
    comment = false;
    blocks = [];

    // We want to deal with LF (\n) only
    style = style.replace(/\r\n/g, '\n');

    while (index < length) {
        ch = style.charAt(index);
        ch2 = style.charAt(index + 1);
        chPrev = style.charAt(index - 1);
        index += 1;

        // Inside a string literal?
        if (isQuote(quote)) {
            formatted += ch;
            if (ch === quote) {
                quote = null;
            }
            if (ch === '\\' && ch2 === quote) {
                // Don't treat escaped character as the closing quote
                formatted += ch2;
                index += 1;
            }
            continue;
        }

        // Starting a string literal?
        if (isQuote(ch)) {
            formatted += ch;
            quote = ch;
            continue;
        }

        // Comment
        if (comment) {
            formatted += ch;
            if (ch === '*' && ch2 === '/') {
                comment = false;
                formatted += ch2;
                index += 1;
            }
            continue;
        }
        if (ch === '/' && ch2 === '*') {
            comment = true;
            formatted += ch;
            formatted += ch2;
            index += 1;
            continue;
        }

        if (state === State.Start) {

            if (blocks.length === 0) {
                if (isWhitespace(ch) && formatted.length === 0) {
                    continue;
                }
            }

            // Copy white spaces and control characters
            if (ch <= ' ' || ch.charCodeAt(0) >= 128) {
                state = State.Start;
                formatted += ch;
                continue;
            }

            // Selector or at-rule
            if (isName(ch) || (ch === '@')) {

                // Clear trailing whitespaces and linefeeds.
                str = trimRight(formatted);

                if (str.length === 0) {
                    // If we have empty string after removing all the trailing
                    // spaces, that means we are right after a block.
                    // Ensure a blank line as the separator.
                    if (blocks.length > 0) {
                        formatted = '\n\n';
                    }
                } else {
                    // After finishing a ruleset or directive statement,
                    // there should be one blank line.
                    if (str.charAt(str.length - 1) === '}' || str.charAt(str.length - 1) === ';') {

                        formatted = str + '\n\n';
                    } else {
                        // After block comment, keep all the linefeeds but
                        // start from the first column (remove whitespaces prefix).
                        while (true) {
                            ch2 = formatted.charAt(formatted.length - 1);
                            if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                break;
                            }
                            formatted = formatted.substr(0, formatted.length - 1);
                        }
                    }
                }
                formatted += ch;
                state = (ch === '@') ? State.AtRule : State.Selector;
                continue;
            }
        }

        if (state === State.AtRule) {

            // ';' terminates a statement.
            if (ch === ';') {
                formatted += ch;
                state = State.Start;
                continue;
            }

            // '{' starts a block
            if (ch === '{') {
                str = trimRight(formatted);
                openBlock();
                state = (str === '@font-face') ? State.Ruleset : State.Block;
                continue;
            }

            formatted += ch;
            continue;
        }

        if (state === State.Block) {

            // Selector
            if (isName(ch)) {

                // Clear trailing whitespaces and linefeeds.
                str = trimRight(formatted);

                if (str.length === 0) {
                    // If we have empty string after removing all the trailing
                    // spaces, that means we are right after a block.
                    // Ensure a blank line as the separator.
                    if (blocks.length > 0) {
                        formatted = '\n\n';
                    }
                } else {
                    // Insert blank line if necessary.
                    if (str.charAt(str.length - 1) === '}') {
                        formatted = str + '\n\n';
                    } else {
                        // After block comment, keep all the linefeeds but
                        // start from the first column (remove whitespaces prefix).
                        while (true) {
                            ch2 = formatted.charAt(formatted.length - 1);
                            if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                break;
                            }
                            formatted = formatted.substr(0, formatted.length - 1);
                        }
                    }
                }

                appendIndent();
                formatted += ch;
                state = State.Selector;
                continue;
            }

            // '}' resets the state.
            if (ch === '}') {
                closeBlock();
                state = State.Start;
                continue;
            }

            formatted += ch;
            continue;
        }

        if (state === State.Selector) {
            // '{' starts the ruleset.
            if (ch === '{') {
                openBlock();
                state = State.Ruleset;
                continue;
            }

            // '}' resets the state.
            if (ch === '}') {
                closeBlock();
                state = State.Start;
                continue;
            }

            formatted += ch;
            continue;
        }

        if (state === State.Ruleset) {

            // '}' finishes the ruleset.
            if (ch === '}') {
                closeBlock();
                state = State.Start;
                if (depth > 0) {
                    state = State.Block;
                }
                continue;
            }

            // Make sure there is no blank line or trailing spaces inbetween
            if (ch === '\n') {
                formatted = trimRight(formatted);
                formatted += '\n';
                continue;
            }

            // property name
            if (!isWhitespace(ch)) {
                formatted = trimRight(formatted);
                formatted += '\n';
                appendIndent();
                formatted += ch;
                state = State.Property;
                continue;
            }
            formatted += ch;
            continue;
        }

        if (state === State.Property) {

            // ':' concludes the property.
            if (ch === ':') {
                formatted = trimRight(formatted);
                formatted += ': ';
                state = State.Expression;
                if (isWhitespace(ch2)) {
                    state = State.Separator;
                }
                continue;
            }

            // '}' finishes the ruleset.
            if (ch === '}') {
                closeBlock();
                state = State.Start;
                if (depth > 0) {
                    state = State.Block;
                }
                continue;
            }

            formatted += ch;
            continue;
        }

        if (state === State.Separator) {

            // Non-whitespace starts the expression.
            if (!isWhitespace(ch)) {
                formatted += ch;
                state = State.Expression;
                continue;
            }

            // Anticipate string literal.
            if (isQuote(ch2)) {
                state = State.Expression;
            }

            continue;
        }

        if (state === State.Expression) {

            // '}' finishes the ruleset.
            if (ch === '}') {
                closeBlock();
                state = State.Start;
                if (depth > 0) {
                    state = State.Block;
                }
                continue;
            }

            // ';' completes the declaration.
            if (ch === ';') {
                formatted = trimRight(formatted);
                formatted += ';\n';
                state = State.Ruleset;
                continue;
            }

            formatted += ch;

            if (ch === '(') {
                if (formatted.charAt(formatted.length - 2) === 'l' && formatted.charAt(formatted.length - 3) === 'r' && formatted.charAt(formatted.length - 4) === 'u') {

                    // URL starts with '(' and closes with ')'.
                    state = State.URL;
                    continue;
                }
            }

            continue;
        }

        if (state === State.URL) {

            // ')' finishes the URL (only if it is not escaped).
            if (ch === ')' && formatted.charAt(formatted.length - 1 !== '\\')) {
                formatted += ch;
                state = State.Expression;
                continue;
            }
        }

        // The default action is to copy the character (to prevent
        // infinite loop).
        formatted += ch;
    }

    formatted = blocks.join('') + formatted;
    formatted = formatted.replace(/,\s/g, ',\n');

    return formatted;
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
 * @param {number} ms - Milliseconds to wait.
 * @param {boolean} [synchronous=false] - Wait synchronously.
 */
async function wait(ms, synchronous=false) {
    var _wait = (ms, synchronous) => {
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

async function waitNewTest(ms, synchronous = false) {
    if (synchronous) {
        var start = Date.now();
        var now = start;
        // var diffs = [];

        while (now - start < ms) {
            // diffs.push('diff: ' + (now - start).toString() + '    ms: ' + ms);
            now = Date.now();
        }

        // console.log(diffs.join('\n'));
    } else {
        var start = Date.now();
        var now = start;

        function _waitAsyncWorker(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async function _wait() {
            if (now - start < ms) {
                await _waitAsyncWorker(1);
                now = Date.now();
                await _wait;
            }
        }

        await _wait();
        // await _wait(ms, synchronous);
    }
}

function hrtimeDurationToMilliseconds(hrtime) {
    return ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
}

function midLeadingZeroFix(mid) {
    //         if (mid.length > 7 && mid.length < 12) {
    while (mid.length < 12) {
        mid = '0' + mid;
    }
    //         }

    return mid;
}

function toTitleCase(s) {
    var i, j, str, lowers, uppers;
    str = s.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0,
        j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt) {
            return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0,
        j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

    return str;
}

function getType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1];
}

function type(obj) {
    var typeVar = (function(global) {
        var cache = {};
        return function(obj) {
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
    }(this));

    return typeVar(obj);
}

function getObjectProperties_Old(obj, filterBy) {
    var currentModelProps = []

    if (filterBy === null)
        filterBy = [];

    do {
        currentModelProps.push(...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj))
    } while ((obj = Object.getPrototypeOf(obj)))

    if (filterBy != null) {
        if (getType(filterBy) === 'String')
            filterBy = [filterBy];
        currentModelProps = currentModelProps.containsPartialArray(filterBy);
    }

    return currentModelProps;
}

function getObjectProperties(obj, filterBy, copyStr2Clipboard) {
    var allProps = {};
    var curr = obj;
    var tabStr = ' '.repeat(3);
    var level = 0;
    var sb = new StringBuilderEx();
    var levelIndicatorStr = '_';

    var re1 = new RegExp('\\s', 'g');
    var re2 = new RegExp(levelIndicatorStr, 'g');
    var re3 = new RegExp(levelIndicatorStr + '$');

    var add = true;

    var funcArray = [Object.getOwnPropertyNames, Object.getOwnPropertySymbols]
    do {
        for (let i = 0; i < funcArray.length; i++) {
            const func = funcArray[i];

            var props = func(curr)

            props.forEach(function(prop, index, array) {
                if (filterBy != null) {
                    if (type(filterBy) == 'Array') {
                        for (let i = 0; i < filterBy.length; i++) {
                            const filterByItem = filterBy[i];

                            if (prop.contains(filterByItem, true)) {
                                add = true;
                                break;
                            } else {
                                add = false;
                            }
                        }
                    } else if (type(filterBy) == 'string') {
                        if (prop.contains(filterBy, true))
                            add = true;
                        else
                            add = false;
                    } else {
                        add = true;
                    }
                } else {
                    add = true;
                }

                if (add) {
                    if (allProps[prop] == null)
                        allProps[prop] = obj[prop];

                    if (copyStr2Clipboard) {
                        var val = typeof(obj[prop]) == 'function' ? '[function]' : obj[prop];
                        val = typeof(val) == 'object' ? JSON.stringifyEx(val) : val;

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
    } while (curr = Object.getPrototypeOf(curr))

    if (copyStr2Clipboard)
        copy(sb.toString());

    return allProps;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @returns 
 */
function debounce(func, wait, immediate) {
    var timeout;

    return function() {
        var context = this,
            args = arguments;

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

function equals(x, y) {
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

        if (typeof(x[p]) !== "object") return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!Object.equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}

function removeAllSelections() {
    if (window.getSelection) {
        if (window.getSelection().empty)  // Chrome
            window.getSelection().empty();
        else if (window.getSelection().removeAllRanges)  // Firefox
            window.getSelection().removeAllRanges();
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

function isEncoded(uri) {
    uri = uri || '';

    return uri !== decodeURIComponent(uri);
}

function fullyDecodeURI(uri) {
    while (isEncoded(uri))
        uri = decodeURIComponent(uri);

    return uri;
}

/**
 * Get difference in days between two dates.
 * 
 * @param {Date} a
 * @param {Date} b
 * @returns 
 */
function dateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function merge(target) {
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function keySort(keys, desc) {
    return function(a, b) {
        let aVal = null;
        let bVal = null;

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
};

function printTable(list) {
    let longestWordLength = 0;

    for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        for (let i = 0; i < subList.length; i++) {
            var currentWordLength = subList[i].toString().length;

            if (currentWordLength > longestWordLength)
                longestWordLength = currentWordLength;
        }
    }

    let newLinesList = [];

    for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        var newLine = '';
        let formatPattern = [];

        if (i == 0) {
            for (let i = 0; i < list[0].length - 1; i++) formatPattern.push('{' + i + ', ~' + longestWordLength + '}'); formatPattern = formatPattern.join(' | ');
            newLine = '|  ' + formatPattern.format(...subList) + '  |';
            newLinesList.push('='.repeat(newLine.length));
            newLinesList.push(newLine);
            newLinesList.push('='.repeat(newLine.length));
        } else {
            for (let i = 0; i < list[0].length - 1; i++) formatPattern.push('{' + i + ', -' + longestWordLength + '}'); formatPattern = formatPattern.join(' | ');
            newLine = '|  ' + formatPattern.format(...subList) + '  |';
            newLinesList.push(newLine);
            if (i == list.length - 1)
                newLinesList.push('='.repeat(newLine.length));
        }
    }

    console.log(newLinesList.join('\n'));
}

function pp(obj) {
    console.log(pformat(obj));
}

function pformat(obj, space=4) {
    return JSON.stringify(obj, null, space);
}

//#endregion Helper Functions

//#region Prototype Functions

//#region String

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{((\d+)|(\d+),((\s+?|.?)(-?|.?)\d+))}/g, function(match, number, match2, number2) {
        if (match2 == undefined) {
            var pad = number.split(',')[1].trim();
            var padNumber = parseInt(pad.replace(/-|~/g, ''));
            var replaceWith = args[number2].toString();
            var diff = padNumber - replaceWith.length;
            diff = (diff > -1) ? diff : 0;
            if (pad.indexOf('-') > -1) {
                return replaceWith + ' '.repeat(diff);
            } else if (pad.indexOf('~') > -1) {
                var s = replaceWith + ' '.repeat(diff);
                var spacesCount = s.match(/^\s*/)[0].length + s.match(/.+[^\s](\s*)/)[1].length;
                return ' '.repeat(Math.floor(spacesCount / 2)) + s.trim() + ' '.repeat(Math.ceil(spacesCount / 2));
            } else {
                return ' '.repeat(diff) + replaceWith;
            }
        } else if (match2 != undefined) {
            return args[match2];
        }
    });
};

String.prototype.contains = function(str, caseSensitive) {
    if (caseSensitive)
        return this.toLowerCase().indexOf(str.toLowerCase()) != -1;
    else
        return this.indexOf(str) != -1;
}

String.prototype.padLeft = function(char, length) {
    return char.repeat(Math.max(0, length - this.length)) + this;
};

String.prototype.padRight = function(char, length) {
    return this.substring(0, length) + char.repeat(Math.max(0, length - this.substring(0, length).length));
};

//#endregion String

//#region Element

if (!isNode()) {
    var ListenerTracker = new function() {
        var is_active = false;
        // listener tracking datas
        var _elements_ = [];
        var _listeners_ = [];
        var _listeners = [];

        this.init = function() {
            if (!is_active) //avoid duplicate call
                intercep_events_listeners();

            is_active = true;
        };
        // register individual element an returns its corresponding listeners
        var register_element = function(element) {
            if (_elements_.indexOf(element) == -1) {
                // NB : split by useCapture to make listener easier to find when removing
                var elt_listeners = [{ /*useCapture=false*/ }, { /*useCapture=true*/ }];
                _elements_.push(element);
                _listeners_.push(elt_listeners);
            }
            return _listeners_[_elements_.indexOf(element)];
        };

        var intercep_events_listeners = function() {
            // backup overrided methods
            var _super_ = {
                "addEventListener": HTMLElement.prototype.addEventListener,
                "removeEventListener": HTMLElement.prototype.removeEventListener
            };

            Element.prototype["addEventListener"] = function(type, listener, useCapture) {
                var listeners = register_element(this);
                // add event before to avoid registering if an error is thrown
                _super_["addEventListener"].apply(this, arguments);
                // adapt to 'elt_listeners' index
                useCapture = useCapture ? 1 : 0;

                if (!listeners[useCapture][type]) listeners[useCapture][type] = [];
                listeners[useCapture][type].push(listener);

                _listeners.push({target: this, type: type, listener: listener});
            };

            Element.prototype["removeEventListener"] = function(type, listener, useCapture) {
                var listeners = register_element(this);
                // add event before to avoid registering if an error is thrown
                _super_["removeEventListener"].apply(this, arguments);
                // adapt to 'elt_listeners' index
                useCapture = useCapture ? 1 : 0;
                if (!listeners[useCapture][type]) return;
                var lid = listeners[useCapture][type].indexOf(listener);
                if (lid > -1) listeners[useCapture][type].splice(lid, 1);
            };

            EventTarget.prototype.removeEventListeners = function(targetType) {
                try {
                    for (var index = 0; index != _listeners.length; index++) {
                        var item = _listeners[index];

                        var target = item.target;
                        var type = item.type;
                        var listener = item.listener;

                        if (target == this && type == targetType)
                            this.removeEventListener(type, listener);
                    }
                } catch (ex) {}
            };

            Element.prototype["getEventListeners"] = function(type) {
                var listeners = register_element(this);
                // convert to listener datas list
                var result = [];
                for (var useCapture = 0, list; list = listeners[useCapture]; useCapture++) {
                    if (typeof(type) == "string") { // filtered by type
                        if (list[type]) {
                            for (var id in list[type]) {
                                result.push({
                                    "type": type,
                                    "listener": list[type][id],
                                    "useCapture": !!useCapture
                                });
                            }
                        }
                    } else { // all
                        for (var _type in list) {
                            for (var id in list[_type]) {
                                result.push({
                                    "type": _type,
                                    "listener": list[_type][id],
                                    "useCapture": !!useCapture
                                });
                            }
                        }
                    }
                }
                return result;
            };
        };
    }();
    ListenerTracker.init();

    Element.prototype.getBackgroundColor = function(pseudoElt) {
        var color = window.getComputedStyle(this, pseudoElt).getPropertyValue('background-color');

        if (color !== 'rgba(0, 0, 0, 0)')
            return color;

        if (this === document.body)
            return false;
        else
            return this.parentElement.getBackgroundColor();
    }

    Object.defineProperty(Element.prototype, 'index', {
        get: function() {
            var nodes = Array.prototype.slice.call(this.parentElement.children);

            return nodes.indexOf(this);
        },
        configurable: true,
        enumerable: true
    });
}

//#endregion Element

//#region Array

Array.prototype.clear = function() {
    while (this.length) {
        this.pop();
    }
}

Array.prototype.pushUnique = function(item) {
    var index = -1;

    for (var i = 0; i < this.length; i++) {
        if (equals(this[i], item))
            index = i;
    }

    if (index === -1)
        this.push(item)
}

Array.prototype.distinct = function(inPlace) {
    var seen = {};
    var retArr = [];

    if (inPlace == null)
        inPlace = false;

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

Array.prototype.getPartialMatches = function(compare, caseSensitive) {
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

    return tempArray;
}

Array.prototype.containsPartial = function(compare, caseSensitive) {
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

Array.prototype.containsPartialArray = function(compareArray) {
    var tempArray = [];

    for (let i = 0; i < compareArray.length; i++) {
        const element = compareArray[i];

        tempArray.push.apply(tempArray, this.filter(function(item) {
            var finder = element;
            var result = eval('/' + finder + '/i').test(item);
            return result;
        }));
    }

    return tempArray.distinct();
}

Array.prototype.forEachAsync = async function(fn) {
    for (let t of this)
        await fn(t);
};

Array.prototype.forEachAsyncParallel = async function(fn) {
    await Promise.all(this.map(fn));
};

Array.prototype.sliceArgs = function() {
    var a = [];

    for (let i = 0; i < arguments[0].length; i++)
        a.push(arguments[0][i]);

    return a;
};

//#endregion Array

//#region JSON

var merge = function(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

JSON.stringifyEx = function(object, replacer, spaces) {
    var simpleObject = {};

    var cache = [];

    if (replacer == null)
        replacer = (key, val) => {
            if (typeof val === 'function') {
                var funcString = `(${val})`;

                return funcString.match(/\((function\(.*?\))/)[1].replace('function', 'f');
            }

            if (typeof val === 'object' && val !== null) {
                if (cache.indexOf(val) !== -1) {
                    // Circular reference found, discard key
                    return;
                }

                cache.push(val);
            }

            return val;
        };

    for (var prop in object) {
        if (!object.hasOwnProperty(prop))
            continue;

        if (typeof(object[prop]) == 'object')
            continue;

        if (typeof(object[prop]) == 'function')
            continue;

        simpleObject[prop] = object[prop];
    }

    if (Object.keys(simpleObject).length === 0 && simpleObject.constructor === Object) {
        object = merge({}, object);
        delete object.toJSON;

        return this.stringify(object, replacer, spaces);
    } else {
        simpleObject = merge({}, simpleObject);
        delete simpleObject.toJSON;

        return this.stringify(simpleObject, replacer, spaces);
    }
}

JSON.parseEx = function(text, reviver) {
    if (reviver == null) {
        return JSON.parse(text, (k, v) => {
            if (typeof v === 'string' && v.indexOf('function') >= 0)
                return eval(v);

            return v;
        });
    }

    return JSON.parse(text, reviver);
}

//#endregion JSON

//#region Function
/*
Object.defineProperty(Function.prototype, 'nameEx', {
    get: function() {
        let d = 1;
        let error = new Error();

        let firefoxMatch = (error.stack.toString().split('\n')[d].match(/^.*(?=@)/) || [])[0];
        let chromeMatch = ((((error.stack.toString().split('at ') || [])[1 + d] || '').match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || '').split('.').pop();
        let safariMatch = error.stack.toString().split('\n')[d];

        let result = firefoxMatch || chromeMatch || safariMatch;

        if (result == '<anonymous>') {
            return (function (func) {
                // Match:
                // - ^          the beginning of the string
                // - function   the word 'function'
                // - \s+        at least some white space
                // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
                // - \s*        optionally followed by white space (in theory there won't be any here,
                //              so if performance is an issue this can be omitted[1]
                // - \(         followed by an opening brace
                //

                var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString())

                return result ? result[1] : '' // for an anonymous function there won't be a match
            })(arguments.callee.caller);
        } else {
            return result;
        }
    },
    configurable: true,
    enumerable: true
});
 */
//#endregion Function

if (!isNode()) {
    (function(console) {
        console.save = function(data, filename) {
            if (!data) {
                console.error('Console.save: No data')
                return;
            }

            if (!filename) filename = 'console.json'

            if (typeof data === "object")
                data = JSON.stringify(data, undefined, 4)

            var blob = new Blob([data], {
                    type: 'text/json'
                }),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')

            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        }
    })(console)
}

//#endregion
