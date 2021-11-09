const assert = require('assert');

suite('simple assertions for the title', () => {
  setup(async () => {
    await browser.url('https://www.google.ru/');
  });

  test('is url valid', async () => {
    assert.strictEqual(await browser.getUrl(), 'https://www.google.ru/');
  });
});
