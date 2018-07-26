export {};
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
