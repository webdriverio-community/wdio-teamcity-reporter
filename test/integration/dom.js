/* globals browser, setup, suite, test */
'use strict'

const assert = require('assert')

suite('simple assertions for the DOM', () => {
  setup(() => {
    browser.url('https://www.google.ru/')
  })

  test('does body exists', () => {
    const klass = browser.$('body').getAttribute('class')
    // do simple assertions assuming that google generates class names
    assert.strictEqual(typeof klass, 'string')
    assert(klass.length > 0)
  })
})
