const assert = require('assert');

suite('simple assertions for the DOM', () => {
  setup(async () => {
    await browser.url('http://guinea-pig.webdriver.io/');
  });

  test('does body exists', async () => {
    const klass = await browser.$('.page').getAttribute('class');
    // do simple assertions assuming that google generates class names
    assert.strictEqual(typeof klass, 'string');
    assert(klass.length > 0);
  });
});
