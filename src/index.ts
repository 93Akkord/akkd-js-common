// tsc && browserify dist/index.js --standalone akkd > dist_bundle/bundle.js && node dist_bundle/bundle.js

import './builtinPrototypes/arrayPrototypes';
import './builtinPrototypes/jsonPrototypes';
import './builtinPrototypes/stringPrototypes';
import './builtinPrototypes/consolePrototypes';
// import './builtinPrototypes/elementPrototypes';
// import { ListenerTracker } from './builtinPrototypes/elementPrototypes';
import './classes/text/StringBuilder';
import './classes/Enum';
import './helpers/helpers';
import { cssBeautify } from './classes/css/CssBeautifier'
import {
    merge,
    getType,
    getObjectProperties,
    getUserDefinedGlobalVars,
    sortObject,
    wait,
    debounce,
    printTable,
    printProps,
    printPropsNew
} from './helpers/helpers';
import * as helpers from './helpers/helpers';
import StringBuilder from './classes/text/StringBuilder';
import { measure } from './utils/performance'

export {
    helpers,
    StringBuilder
};

// (async function () {
//     const _global = (typeof window !== 'undefined') ? window : global as any;
// })().then().catch(err => console.log(err));
