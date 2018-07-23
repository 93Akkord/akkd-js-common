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
