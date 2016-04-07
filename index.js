const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

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
    console.log(`##teamcity[testSuiteStarted name='${escape(suite.title)}']`);
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
  this.on('test:start', test => {
    console.log(`##teamcity[testStarted name='${escape(test.title)}' captureStandardOutput='true']"`);
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
  this.on('test:end', test => {
    console.log(`##teamcity[testFinished name='${escape(test.title)}' duration='']`);
  });

  /**
   * @param  {object}   suite
   * @param  {string}   suite.type
   * @param  {object}   suite.err
   * @param  {string}   suite.title
   * @param  {string}   suite.parent
   * @param  {boolean}  suite.pending
   * @param  {string}   suite.file
   * @param  {string[]} suite.specs
   * @param  {string}   suite.event
   * @param  {object}   suite.runner
   * @param  {string}   suite.specHash
   */
  this.on('test:fail', test => {
    console.log(`##teamcity[testFailed name='${escape(test.title)}' message='${escape(suite.err.message)}' captureStandardOutput='true' details='${escape(suite.err.stack)}']`);
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
  this.on('test:pending', test => {
    console.log(`##teamcity[testIgnored name='${escape(test.title)}' message='pending']`);
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
    console.log(`##teamcity[testSuiteFinished name='${escape(suite.title)}' duration='']`);
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
