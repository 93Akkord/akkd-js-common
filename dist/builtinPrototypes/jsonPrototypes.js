Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers/helpers");
require("../classes/text/StringBuilder");
JSON.stringifyEx = function (obj, spaces = 4, maxLevel = 0, includeFunctionBodies = false, includeFunctions = true) {
    var indentStr = ' '.repeat(spaces);
    var newLineChar = (spaces == 0) ? ' ' : '\n';
    function _stringifyEx(obj, indentLevel = 0, parent) {
        var sb = new StringBuilder();
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
