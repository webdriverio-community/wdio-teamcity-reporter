/* globals browser, setup, suite, test */
'use strict'

const assert = require('assert')

suite('simple exception', () => {
  setup(() => {
    browser.url('https://www.google.ru/')
  })

  test.skip('pending test', () => {})

  test('artificial error', () => {
    assert.strictEqual(browser.$('body').getAttribute('non-existing-attribute'), null)
  })
})

suite('exception in hook', () => {
  setup(() => {
    browser.url('https://www.google.ru/')
    assert.strictEqual(browser.$('body').getAttribute('non-existing-attribute'), null)
  })

  test('failed in setup-hook', () => {
    assert.strictEqual(browser.$('body').getAttribute('non-existing-attribute'), null)
  })
})
