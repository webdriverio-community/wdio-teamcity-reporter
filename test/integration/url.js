'use strict';

const assert = require('assert');

suite('simple assertions for the title', () => {
  setup(() => {
    browser.url('https://www.google.ru/');
  });

  test('is url valid', () => {
    assert.equal(browser.getUrl(), 'https://www.google.ru/');
  });
});
