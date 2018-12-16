// tsc && browserify dist/index.js --standalone akkd > dist_bundle/bundle.js && node dist_bundle/bundle.js
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const helpers = __importStar(require("./helpers/helpers"));
exports.helpers = helpers;
const StringBuilder_1 = __importDefault(require("./classes/text/StringBuilder"));
exports.StringBuilder = StringBuilder_1.default;
// (async function () {
//     const _global = (typeof window !== 'undefined') ? window : global as any;
// })().then().catch(err => console.log(err));
