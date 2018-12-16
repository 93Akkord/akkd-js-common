/// <reference types="../dist/index" />

'use strict';

// var expect = require('chai').expect;
// require('../src/index');

// describe('#akkd-js-common', function() {
//     it('should format string', function() {
//         var result = '{0} {1}'.format('One', 'Two')
//         expect(result).to.equal('One Two');
//     });
// });

var akkd = require('../dist_bundle/bundle');

var sb = new akkd.StringBuilder();

sb.append('test');

console.log('{0} {1}'.format('Michael', 'Barros'));

console.log(sb.toString());
