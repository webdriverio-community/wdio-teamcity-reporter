const assert = require('assert');

suite('simple assertions for the title', () => {
  setup(async () => {
    await browser.url('http://guinea-pig.webdriver.io/');
  });

  test('is url valid', async () => {
    assert.strictEqual(await browser.getUrl(), 'https://guinea-pig.webdriver.io/');
  });
});
