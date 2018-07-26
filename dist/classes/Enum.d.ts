export {};
declare global {
    function Enum(...args: any[]): Enum;
}
export declare class Enum {
    [index: string]: any;
    constructor(...args: any[]);
    toString(): any[];
}
