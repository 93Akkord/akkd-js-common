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
