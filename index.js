'use strict';

const { EventEmitter } = require('events');
const { buildFormatter, events } = require('./lib/message');
const { flow } = require('lodash');
const { inherits } = require('util');

module.exports = WdioTeamcityReporter;
module.exports.reporterName = 'teamcity';

/**
 * @param {object}  baseReporter
 * @param {object}  wdioConf
 * @param {object}  reporterOptions
 * @param {boolean} reporterOptions.captureStandardOutput
 * @param {boolean} reporterOptions.flowId
 * @param {string}  reporterOptions.message
 * @return {wdioTeamcityReporter}
 */
function WdioTeamcityReporter(baseReporter, wdioConf, reporterOptions = {}) {
  const opts = {
    captureStandardOutput: typeof reporterOptions.captureStandardOutput === 'boolean'
      ? reporterOptions.captureStandardOutput
      : false,
    flowId: typeof reporterOptions.flowId === 'boolean'
      ? reporterOptions.flowId
      : true,
    name: typeof reporterOptions.message === 'string'
      ? reporterOptions.message
      : '[title]',
  };

  this.enableRealTimeOutput(opts);
}

inherits(WdioTeamcityReporter, EventEmitter);

WdioTeamcityReporter.prototype.enableRealTimeOutput = function (opts) {
  events.forEach(event => this.on(event, flow(buildFormatter(event, opts), output)));
};

/**
 * @param  {string} msg
 * @return {string}
 */
function output(msg) {
  if (msg) {
    console.log(msg);
  }
}
