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
