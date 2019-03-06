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

  t.test('onSuiteStart', a => {
    const msg = buildFormatter('onSuiteStart', opts).call(reporter, mockSuite('onSuiteStart'));

    a.plan(1);
    assertMsg(a, '##teamcity[testSuiteStarted ', msg);
  });

  t.test('onTestStart', a => {
    const msg = buildFormatter('onTestStart', opts).call(reporter, mockSuite('onTestStart'));

    a.plan(1);
    assertMsg(a, '##teamcity[testStarted ', msg);
  });

  t.test('onTestEnd', a => {
    const msg = buildFormatter('onTestEnd', opts).call(reporter, mockSuite('onTestEnd'));

    a.plan(1);
    assertMsg(a, '##teamcity[testFinished ', msg);
  });

  t.test('onSuiteEnd', a => {
    const msg = buildFormatter('onSuiteEnd', opts).call(reporter, mockSuite('onSuiteEnd'));

    a.plan(1);
    assertMsg(a, '##teamcity[testSuiteFinished ', msg);
  });
});

function assertMsg(util, expectation, result) {
  util.ok(result.indexOf(expectation) === 0,
    `message should start from \`${expectation}\` instead got \`${result}\``);
}
