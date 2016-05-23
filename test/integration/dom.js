'use strict';

const assert = require('assert');

suite('simple assertions for the DOM', () => {
  setup(() => {
    browser.url('https://www.google.ru/');
  });

  test('does body exists', () => {
    assert.equal(browser.getAttribute('body', 'class'), 'hp vasq');
  });
});
