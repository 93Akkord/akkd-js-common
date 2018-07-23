"use strict";
String.prototype.format = function () {
    var args = arguments;
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
String.prototype.contains = function (s, caseSensitive) {
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
