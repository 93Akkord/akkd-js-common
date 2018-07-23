Object.defineProperty(exports, "__esModule", { value: true });
const _global = (typeof window !== 'undefined') ? window : global;
class Enum {
    constructor(...args) {
        for (var i in arguments) {
            this[args[i]] = arguments[i];
        }
    }
    toString() {
        let tempArray = [];
        Object.keys(this).forEach(key => {
            var value = this[key];
            if ((value instanceof Function) == false)
                tempArray.push(value);
        });
        return tempArray;
    }
}
exports.Enum = Enum;
_global.Enum = function (...args) {
    return new Enum(...args);
};
