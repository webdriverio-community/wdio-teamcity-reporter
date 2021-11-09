const assert = require('assert');

suite('simple exception', () => {
  setup(async () => {
    await browser.url('https://www.google.ru/');
  });

  test.skip('pending test', () => {});

  test('artificial error', async () => {
    assert.strictEqual(await browser.$('body').getAttribute('non-existing-attribute'), null);
  });
});

suite('exception in hook', () => {
  setup(async () => {
    await browser.url('https://www.google.ru/');
    assert.strictEqual(await browser.$('body').getAttribute('non-existing-attribute'), null);
  });

  test('failed in setup-hook', async () => {
    assert.strictEqual(await browser.$('body').getAttribute('non-existing-attribute'), null);
  });
});
