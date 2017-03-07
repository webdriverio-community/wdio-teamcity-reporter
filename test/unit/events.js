'use strict';

const { buildFormatter } = require('../../lib/message');
const mockSuite = require('./fixture/suite');
const mockReporterContext = require('./fixture/reporter-context');
const test = require('tape');

const opts = {
  captureStandardOutput: false,
  flowId: false,
  message: '[title]',
};

test('formatter for events', t => {
  const reporter = mockReporterContext();

  t.test('suite:start', a => {
    const msg = buildFormatter('suite:start', opts).call(reporter, mockSuite('suite:start'));

    a.plan(1);
    assertMsg(a, '##teamcity[testSuiteStarted ', msg);
  });

  t.test('test:start', a => {
    const msg = buildFormatter('test:start', opts).call(reporter, mockSuite('test:start'));

    a.plan(1);
    assertMsg(a, '##teamcity[testStarted ', msg);
  });

  t.test('test:end', a => {
    const msg = buildFormatter('test:end', opts).call(reporter, mockSuite('test:end'));

    a.plan(1);
    assertMsg(a, '##teamcity[testFinished ', msg);
  });

  t.test('suite:end', a => {
    const msg = buildFormatter('suite:end', opts).call(reporter, mockSuite('suite:end'));

    a.plan(1);
    assertMsg(a, '##teamcity[testSuiteFinished ', msg);
  });
});

function assertMsg(util, expectation, result) {
  util.ok(result.indexOf(expectation) === 0,
    `message should start from \`${expectation}\` instead got \`${result}\``);
}
