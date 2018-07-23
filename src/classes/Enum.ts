export {}

declare global {
    function Enum(...args: any[]): Enum;
}

const _global = (typeof window !== 'undefined') ? window : global as any;

export class Enum {
    [index: string]: any;

    constructor(...args: any[]) {
        for (var i in arguments) {
            this[args[i]] = arguments[i];
        }
    }

    toString() {
        let tempArray: any[] = [];

        Object.keys(this).forEach(key => {
            var value = this[key];

            if ((value instanceof Function) == false)
                tempArray.push(value);
        });

        return tempArray;
    }
}

_global.Enum = function(...args: any[]): Enum {
    return new Enum(...args);
}
