/* globals browser, setup, suite, test */
'use strict'

const assert = require('assert')

suite('simple assertions for the title', () => {
  setup(() => {
    browser.url('https://www.google.ru/')
  })

  test('is url valid', () => {
    assert.strictEqual(browser.getUrl(), 'https://www.google.ru/')
  })
})
