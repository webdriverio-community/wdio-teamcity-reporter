const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;
const EOL = require('os').EOL;

const o = msg => console.log(msg);

/**
 * http://webdriver.io/guide/reporters/customreporter.html
 * https://github.com/webdriverio/webdriverio/blob/master/lib/utils/BaseReporter.js
 */
function WdioTeamcityReporter() {
  EventEmitter.call(this);

  /**
   * @param  {object}   suite
   * @param  {string}   suite.type
   * @param  {string}   suite.title
   * @param  {string}   suite.parent
   * @param  {boolean}  suite.pending
   * @param  {string}   suite.file
   * @param  {string[]} suite.specs
   * @param  {string}   suite.event
   * @param  {object}   suite.runner
   */
  this.on('suite:start', suite => {
    o(`##teamcity[testSuiteStarted name='${escape(suite.title)}']`);
  });

  /**
   * @param  {object}   test
   * @param  {string}   test.type
   * @param  {string}   test.title
   * @param  {string}   test.parent
   * @param  {boolean}  test.pending
   * @param  {string}   test.file
   * @param  {string[]} test.specs
   * @param  {string}   test.event
   * @param  {object}   test.runner
   * @param  {string}   test.specHash
   */
  this.on('test:start', test => {
    o(`##teamcity[testStarted name='${escape(test.title)}' captureStandardOutput='true']"`);
  });

  /**
   * @param  {object}   test
   * @param  {string}   test.type
   * @param  {string}   test.title
   * @param  {string}   test.parent
   * @param  {boolean}  test.pending
   * @param  {string}   test.file
   * @param  {string[]} test.specs
   * @param  {string}   test.event
   * @param  {object}   test.runner
   * @param  {string}   test.specHash
   */
  this.on('test:end', test => {
    o(`##teamcity[testFinished name='${escape(test.title)}']`);
  });

  /**
   * @param  {object}   test
   * @param  {string}   test.type
   * @param  {object}   test.err
   * @param  {string}   test.title
   * @param  {string}   test.parent
   * @param  {boolean}  test.pending
   * @param  {string}   test.file
   * @param  {string[]} test.specs
   * @param  {string}   test.event
   * @param  {object}   test.runner
   * @param  {string}   test.specHash
   */
  this.on('test:fail', test => {
    o(`##teamcity[testFailed name='${escape(test.title)}' message='${escape(test.err.message)}' details='${escape(test.err.stack)}']`);
  });

  /**
   * @param  {object}   test
   * @param  {string}   test.type
   * @param  {string}   test.title
   * @param  {string}   test.parent
   * @param  {boolean}  test.pending
   * @param  {string}   test.file
   * @param  {string[]} test.specs
   * @param  {string}   test.event
   * @param  {object}   test.runner
   * @param  {string}   test.specHash
   */
  this.on('test:pending', test => {
    o(`##teamcity[testIgnored name='${escape(test.title)}' message='pending']`);
  });

  /**
   * @param  {object}   suite
   * @param  {string}   suite.type
   * @param  {string}   suite.title
   * @param  {string}   suite.parent
   * @param  {boolean}  suite.pending
   * @param  {string}   suite.file
   * @param  {string[]} suite.specs
   * @param  {string}   suite.event
   * @param  {object}   suite.runner
   * @param  {string}   suite.specHash
   */
  this.on('suite:end', suite => {
    o(`##teamcity[testSuiteFinished name='${escape(suite.title)}']`);
  });
}

inherits(WdioTeamcityReporter, EventEmitter);

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
