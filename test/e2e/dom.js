const assert = require('assert');

suite('simple assertions for the DOM', () => {
  setup(async () => {
    await browser.url('https://www.google.ru/');
  });

  test('does body exists', async () => {
    const klass = await browser.$('body').getAttribute('class');
    // do simple assertions assuming that google generates class names
    assert.strictEqual(typeof klass, 'string');
    assert(klass.length > 0);
  });
});
