declare global {
    interface JSON {
        stringifyEx(object: any, spaces?: string | number, maxLevel?: number | null, includeFunctionBodies?: boolean, includeFunctions?: boolean): string;
        parseEx(text: string, reviver?: (key: any, value: any) => any): any;
    }
}
export {};
