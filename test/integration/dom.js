/* globals browser, setup, suite, test */
'use strict'

const assert = require('assert')

suite('simple assertions for the DOM', () => {
  setup(() => {
    browser.url('https://www.google.ru/')
  })

  test('does body exists', () => {
    assert.strictEqual(browser.$('body').getAttribute('class'), 'hp vasq')
  })
})
