import '../../builtinPrototypes/stringPrototypes';
declare global {
    class StringBuilder extends Array {
        append(str: string, ...args: any[]): StringBuilder;
        appendLine(str: string, ...args: any[]): StringBuilder;
        toString(): string;
        clear(): void;
    }
}
export declare class StringBuilder extends Array {
    id: number;
    append(str: string, ...args: any[]): StringBuilder;
    appendLine(str: string, ...args: any[]): StringBuilder;
    toString(): string;
    clear(): void;
}
