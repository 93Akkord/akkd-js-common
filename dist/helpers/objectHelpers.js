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
