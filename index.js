'use strict';

const { inherits } = require('util');
const { EventEmitter } = require('events');

const o = msg => console.log(msg);

/**
 * http://webdriver.io/guide/reporters/customreporter.html
 * https://github.com/webdriverio/webdriverio/blob/master/lib/utils/BaseReporter.js
 */
function WdioTeamcityReporter() {
  EventEmitter.call(this);

  this.enableRealTimeOutput();
}

inherits(WdioTeamcityReporter, EventEmitter);

/**
 * Makes it possible to display test results in real-time.
 *
 * Suite event handler accepts:
 * * @param  {object}   suite
 * * @param  {string}   suite.type
 * * @param  {string}   suite.title
 * * @param  {string}   suite.parent
 * * @param  {boolean}  suite.pending
 * * @param  {string}   suite.file
 * * @param  {string[]} suite.specs
 * * @param  {string}   suite.event
 * * @param  {object}   suite.runner
 * * @param  {string}   [suite.specHash] is available for the suite:end event
 *
 * Each test event handler accepts:
 * * @param  {object}   test
 * * @param  {string}   test.type
 * * @param  {object}   [test.err] is available for the test:fail event
 * * @param  {string}   test.title
 * * @param  {string}   test.parent
 * * @param  {boolean}  test.pending
 * * @param  {string}   test.file
 * * @param  {string[]} test.specs
 * * @param  {string}   test.event
 * * @param  {object}   test.runner
 * * @param  {string}   test.specHash
 */
WdioTeamcityReporter.prototype.enableRealTimeOutput = function () {
  const handlers = {
    'suite:start': suite => o(`##teamcity[testSuiteStarted name='${escape(suite.title)}']`),
    'test:start': test => o(`##teamcity[testStarted name='${escape(test.title)}' captureStandardOutput='true']"`),
    'test:end': test => o(`##teamcity[testFinished name='${escape(test.title)}']`),
    'test:fail': test => o(`##teamcity[testFailed name='${escape(test.title)}' message='${escape(test.err.message)}' details='${escape(test.err.stack)}']`),
    'test:pending': test => o(`##teamcity[testIgnored name='${escape(test.title)}' message='pending']`),
    'suite:end': suite => o(`##teamcity[testSuiteFinished name='${escape(suite.title)}']`),
  };

  Object.keys(handlers).forEach(event => this.on(event, handlers[event]));
};

module.exports = WdioTeamcityReporter;
module.exports.reporterName = 'teamcity';

/**
 * Escape the given `str`.
 *
 * @param {string} str
 * @return {string}
 */
function escape(str) {
  if (!str) {
    return '';
  }

  return str
    .toString()
    .replace(/\x1B.*?m/g, "")
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}
