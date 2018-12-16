import '../../builtinPrototypes/stringPrototypes';
import { randomInt } from '../../helpers/helpers'

declare global {
    class StringBuilder extends Array {
        append(str: string, ...args: any[]): StringBuilder;
        appendLine(str: string, ...args: any[]): StringBuilder;
        toString(): string;
        clear(): void;
    }
}

const _global = (typeof window !== 'undefined') ? window : global as any;

export default class StringBuilder extends Array {
    id: number = randomInt(1000, 9999);

    append(str: string, ...args: any[]): StringBuilder {
        if (args.length == 0)
            this.push(str);
        else
            this.push(str.format(...args));

        return this;
    }

    appendLine(str: string, ...args: any[]): StringBuilder {
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

_global.StringBuilder = StringBuilder;
