import {
    getType,
    removeAllButLastStrPattern,
    sortDescending,
    sortAscending
} from './helpers';

const _global = (typeof window !== 'undefined') ? window : global as any;

export function merge(target: any, ...args: any[]): any {
    return Object.assign(target, ...args);
}

export function getObjectProperties(obj: any, filterBy?: any, copyStr2Clipboard: any = false) {
    var allProps: any = {};
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

            var props = func(curr) as Array<any>;

            props.forEach(function(prop, index, array) {
                if (filterBy != null) {
                    if (getType(filterBy) == 'Array') {
                        for (let i = 0; i < filterBy.length; i++) {
                            const filterByItem = filterBy[i];

                            if (prop.contains(filterByItem, true)) {
                                add = true;
                                break;
                            } else {
                                add = false;
                            }
                        }
                    } else if (getType(filterBy) == 'string') {
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
        _global.copy(sb.toString());

    return allProps;
}

export function getUserDefinedGlobalVars(): any {
    var results;
    var currentWindow; // create an iframe and append to body to load a clean window object
    var iframe = document.createElement('iframe');

    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // get the current list of properties on window
    currentWindow = Object.getOwnPropertyNames(_global);
    // filter the list against the properties that exist in the clean window
    results = currentWindow.filter(function(prop) {
        return (iframe.contentWindow != null) ? !iframe.contentWindow.hasOwnProperty(prop): false;
    });

    var tempObj: any = {};

    for (let index = 0; index < results.length; index++) {
        const propName = results[index];
        tempObj[propName] = _global[propName];
    }

    document.body.removeChild(iframe);

    return tempObj;
}

export function sortObject(o: any, desc: boolean = false) {
    var sorted: any = {};
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

export function printPropsNew(obj: any) {
    var headerFooterBanner = '=========================================================';

    console.log(headerFooterBanner);

    function _printProps(obj: any) {
        for (var key in obj) {
            // console.log('type:', getType([obj[key]]));
            if (getType([obj[key]]) == 'Object') {
                _printProps([obj[key]]);
            } else if (getType([obj[key]]) == 'Array') {
                console.log(key + ': ', JSON.stringifyEx([obj[key]]));
            } else {
                console.log(key + ': ', [obj[key]]);
            }
        }
    }

    _printProps(obj);

    console.log(headerFooterBanner);
}

export function printProps(obj: any) {
    var headerFooterBanner = '=========================================================';

    console.log(headerFooterBanner);

    function _printProps(obj: any) {
        for (var key in obj) {
            console.log(key + ': ', [obj[key]]);
        }
    }

    _printProps(obj);

    console.log(headerFooterBanner);
}
