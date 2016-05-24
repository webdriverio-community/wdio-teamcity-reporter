'use strict';

const { escape } = require('../../lib/message');
const test = require('tape');

test('escaping', t => {
  t.equal(escape('comma \' in the text'), 'comma |\' in the text');
  t.equal(escape('\u0085\u2028\u2029'), '|x|l|p');
  t.end();
});
