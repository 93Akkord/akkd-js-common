Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
async function measure(funcs, times = 10, millisecLength = 3, useDate = true) {
    funcs = (helpers_1.getType(funcs) == 'function') ? [funcs] : funcs;
    for (let i = 0; i < funcs.length; i++) {
        funcs[i] = (helpers_1.getType(funcs[i]) == 'function') ? { function: funcs[i] } : funcs[i];
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
    results.sort(helpers_1.keySort(['avg_raw'], false));
    // Print stats
    console.log(colPatternTitle.format('', 'Function', 'Total', 'Min', 'Max', 'Avg'));
    for (let i = 0; i < results.length; i++)
        console.log(colPattern.format((i + 1) + '.', results[i].title, results[i].total, results[i].min, results[i].max, results[i].avg));
    if (results.length > 1)
        console.log('{0} is {1} faster than {2}.\n'.format(results[0].title, ((results[1].avg_raw - results[0].avg_raw) / results[0].avg_raw).toFixed(2), results[1].title));
}
exports.measure = measure;
