import '../builtinPrototypes/stringPrototypes';
import '../builtinPrototypes/arrayPrototypes';
import '../builtinPrototypes/jsonPrototypes';
import '../classes/text/StringBuilder';
import { merge, getObjectProperties, getUserDefinedGlobalVars, sortObject, printProps, printPropsNew } from './objectHelpers';
import { dateDiffInDays } from './dateHelpers';
export { merge, getObjectProperties, getUserDefinedGlobalVars, sortObject, dateDiffInDays, printProps, printPropsNew };
declare global {
    function pp(obj: any, space?: number): void;
}
export declare function randomInt(min: number, max: number): number;
export declare function randomFloat(min: number, max: number): number;
export declare function equals(x: any, y: any): boolean;
export declare function isNode(): boolean;
export declare function getType(obj: any, getInherited?: boolean): any;
export declare function removeAllButLastStrPattern(str: string, token: string): string;
/**
 * Async wait function.
 * Example:
 * (async () => {
 *     await wait(4000).then(() => {
 *         console.log(new Date().toLocaleTimeString());
 *     }).then(() => {
 *         console.log('here');
 *     });
 * })();
 *
 * @param {number} ms Milliseconds to wait.
 * @param {boolean} [synchronous=false] Wait synchronously.
 */
export declare function wait(ms: number, synchronous?: boolean): Promise<void>;
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {Function} debounced function.
 */
export declare function debounce(func: Function, wait: number, immediate?: boolean): Function;
export declare function pp(obj: any, space?: number): void;
export declare function pformat(obj: any, space?: number): string;
export declare function isEncoded(uri: string): boolean;
export declare function fullyDecodeURI(uri: string): string;
export declare function keySort(keys: string[], desc?: boolean): (a: any, b: any) => number;
export declare function sortAscending(a: any, b: any): 1 | -1 | 0;
export declare function sortDescending(a: any, b: any): 1 | -1 | 0;
export declare function printTable(rows: any[], includeIndex?: boolean): void;
