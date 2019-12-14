'use strict';

const Reporter = require('../../').default;
const test = require('tape');

const events = [
  'onRunnerStart',
  'onBeforeCommand',
  'onAfterCommand',
  'onScreenshot',
  'onSuiteStart',
  'onHookStart',
  'onHookEnd',
  'onTestStart',
  'onTestPass',
  'onTestFail',
  'onTestSkip',
  'onTestEnd',
  'onSuiteEnd',
  'onRunnerEnd',
];

const reporter = new Reporter({});
reporter.outputStream = {
  write(msg) {
    console.log(msg);
  },
};

events.forEach(event => test(event, t => {
  const data = {
    cid: '0-0',
    type: event,
    title: `title for ${event}`,
    parent: '',
    pending: false,
    file: `absolute filepath for ${event}`,
    specs: [''],
    event: event,
    runner: {},
    specHash: '98d5f98abe0e1d6b68d654ead0a9ce77',
  };

  if (event.indexOf('fail') > -1) {
    data.error = new Error('artificial error');
  }

  reporter[event](data);
  t.end();
}));
