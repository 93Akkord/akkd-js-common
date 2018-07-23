export { }

declare global {
    interface String {
        format(...args: any[]): string;
        contains(s: string, caseSensitive?: boolean): boolean;
        padLeft(char: string, length: number): string;
        padRight(char: string, length: number): string;
        toTitleCase(): string;
        replaceLast(what: string, replacement: string): string;
    }
}

String.prototype.format = function(...args: any[]): string {
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
                let s: string = replaceWith + ' '.repeat(diff);
                let re1 = s.match(/^\s*/);
                let re2 = s.match(/.+[^\s](\s*)/);
                let spacesCount1: number = (re1 != null) ? re1[0].length : 0;
                let spacesCount2: number = (re2 != null && re2.length > 1) ? re2[1].length : 0;
                let spacesCount: number = spacesCount1 + spacesCount2;
                return ' '.repeat(Math.floor(spacesCount / 2)) + s.trim() + ' '.repeat(Math.ceil(spacesCount / 2));
            } else {
                return ' '.repeat(diff) + replaceWith;
            }
        } else if (match2 != undefined) {
            return args[match2];
        }
    });
};

String.prototype.contains = function(s: string, caseSensitive: boolean = false): boolean {
    if (caseSensitive)
        return this.toLowerCase().indexOf(s.toLowerCase()) != -1;
    else
        return this.indexOf(s) != -1;
}

String.prototype.padLeft = function(char: string, length: number): string {
    return char.repeat(Math.max(0, length - this.length)) + this;
};

String.prototype.padRight = function(char: string, length: number): string {
    return this.substring(0, length) + char.repeat(Math.max(0, length - this.substring(0, length).length));
};

String.prototype.toTitleCase = function(): string {
    var i: number;
    var j: number;
    var str: string
    var lowers: string[];
    var uppers: string[];

    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt) {
            return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

    return str;
}

String.prototype.replaceLast = function(what: string, replacement: string): string {
    return this.split(' ').reverse().join(' ').replace(new RegExp(what), replacement).split(' ').reverse().join(' ');
};
