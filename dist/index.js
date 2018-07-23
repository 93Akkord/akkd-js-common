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
const helpers_1 = require("./helpers/helpers");
console.log(helpers_1.getType('s'));
// (async function () {
//     const _global = (typeof window !== 'undefined') ? window : global as any;
//     console.clear();
//     var obj: any = {
//         firstName: 'Michael',
//         lastName: 'Barros',
//         homeAddress: {
//             street: '11728 NW 26 CT',
//             city: 'Coral Springs',
//             get homeAddress(): any {
//                 return this;
//             }
//         },
//         getAge: function(birthYear: number, currentYear: number) {
//             return currentYear - birthYear;
//         },
//         getYearBorn: (age: number, currentYear: number) => {
//             return currentYear - age;
//         },
//     }
//     class Circular {
//         value: string;
//         self: Circular;
//         person: any;
//         constructor() {
//             this.value = 'Hello World';
//             this.self = this;
//             this.person = obj;
//         }
//     }
//     var circular = new Circular();
//     var list = [
//         1,
//         2,
//         3,
//         obj,
//         circular
//     ];
//     var o = {
//         person: obj,
//         list: list,
//         circular: circular,
//         sb: (new StringBuilder).constructor.name,
//         date: new Date(),
//         number: 1
//     }
//     function testObjectTypes() {
//         var objList = [
//             new Date(),
//             1,
//             's',
//             new StringBuilder(),
//             JSON,
//             {},
//             []
//         ]
//         objList.forEach(obj => {
//             console.log('value: {0}'.format(obj));
//             console.log('getType: {0}'.format(getType(obj)));
//             console.log('toString: {0}'.format(({}).toString.call(obj)));
//             console.log('typeof: {0}'.format(typeof(obj)));
//             console.log('constructor: {0}'.format(obj.constructor.name));
//             console.log('');
//         });
//     }
//     function testWrapper(func: any) {
//         var header = '================== ' + arguments.callee.caller.name + ' ==================';
//         console.log(header);
//         func();
//         console.log('='.repeat(header.length) + '\n\n');
//     }
//     function test01() {
//         testWrapper(function test01() {
//             var obj1 = {
//                 a: Symbol.for('a'),
//                 add: function(x: any,y: any){
//                     var s1 = 'str1';
//                     var s2 = 'str2';
//                     // comments
//                     return x+y+'    '+s1+' '+s2;
//                 },
//                 substract: (x: any,y: any)=>x-y
//             }
//             var objs = [obj1];
//             objs.forEach(function(obj) {
//                 var saved_old = JSON.stringify(obj, (k,v) => typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v);
//                 var saved = JSON.stringifyEx(obj, 4, 0, true);
//                 // const restored = JSON.parse(saved, (k,v) => {
//                 //       const matches = v.match && v.match(/^\$\$Symbol:(.*)$/)
//                 //       return matches ? Symbol.for(matches[1]) : v
//                 // })
//                 // console.log('saved_old:', saved_old);
//                 console.log('  new_old:', saved);
//                 console.log('\n\n\n');
//                 // console.log('  before:', obj);
//                 var restored = JSON.parseEx(saved);
//                 console.log('restored:', restored);
//                 console.log(restored.add(5, 30));
//                 console.log(obj.substract(5, 30));
//                 console.log('');
//             })
//         });
//     }
//     function test02() {
//         testWrapper(function test01() {
//             // console.log(global);
//             var saved = JSON.stringifyEx(global, 4, 0, true, true);
//             console.log(saved);
//             // pp(global);
//             // console.log('toStringTag:', global['__core-js_shared__'].wks.toStringTag);
//             // console.log('asyncIterator:', global['__core-js_shared__'].wks.asyncIterator);
//             // console.log(global[global['__core-js_shared__'].wks.toStringTag]);
//             // console.log(global[global['__core-js_shared__'].wks.asyncIterator]);
//             // console.log(Object.getOwnPropertySymbols(global));
//             console.log('');
//             // var restored = JSON.parseEx(saved);
//             // console.log('restored:', restored);
//             // pp(global);
//             // test01();
//             // toStringTag: Symbol(Symbol.toStringTag),
//             // a: Symbol(a)
//         });
//     }
//     var rows = [
//         ['first_name', 'last_name', 'days'],
//         ['michael', 'johnson johnson', 525],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['michael', 'johnson johnson', 525],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//         ['chris', 'allen', 322156162],
//     ]
//     printTable(rows, true);
//     // test01();
//     // test02();
// })().then().catch(err => console.log(err));
