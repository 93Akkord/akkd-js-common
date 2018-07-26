// tsc && browserify dist/index.js --standalone akkd > dist_bundle/bundle.js && node dist_bundle/bundle.js
Object.defineProperty(exports, "__esModule", { value: true });
require("./builtinPrototypes/arrayPrototypes");
require("./builtinPrototypes/jsonPrototypes");
require("./builtinPrototypes/stringPrototypes");
require("./builtinPrototypes/consolePrototypes");
// import './builtinPrototypes/elementPrototypes';
// import { ListenerTracker } from './builtinPrototypes/elementPrototypes';
require("./classes/text/StringBuilder");
require("./classes/Enum");
require("./helpers/helpers");
// (async function () {
//     const _global = (typeof window !== 'undefined') ? window : global as any;
// })().then().catch(err => console.log(err));
