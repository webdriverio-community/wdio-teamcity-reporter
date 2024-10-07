const assert = require('assert');

suite('simple exception', () => {
  setup(async () => {
    await browser.url('http://guinea-pig.webdriver.io/');
  });

  test.skip('pending test', () => {});

  test('artificial error', async () => {
    assert.strictEqual(await browser.$('header').getAttribute('non-existing-attribute'), null);
  });
});

suite('exception in hook', () => {
  setup(async () => {
    await browser.url('http://guinea-pig.webdriver.io/');
    assert.strictEqual(await browser.$('header').getAttribute('non-existing-attribute'), null);
  });

  test('failed in setup-hook', async () => {
    assert.strictEqual(await browser.$('header').getAttribute('non-existing-attribute'), null);
  });
});
