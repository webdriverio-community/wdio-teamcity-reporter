'use strict';

const Reporter = require('../../');
const mockReporterContext = require('./fixture/reporter-context');
const test = require('tape');

const events = [
  'start',
  'suite:start',
  'hook:start',
  'hook:end',
  'test:start',
  'test:end',
  'test:pass',
  'test:fail',
  'test:pending',
  'suite:end',
  'end',
];

const mockedContext = mockReporterContext();
const reporter = new Reporter(mockedContext.baseReporter);

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
    data.err = new Error('artificial error');
  }

  reporter.emit(event, data);
  t.end();
}));
