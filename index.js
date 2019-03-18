'use strict';

const WdioReporter = require('@wdio/reporter').default;
const { buildFormatter, events } = require('./lib/message');
const { flow } = require('lodash');

/**
 * @param {object}  baseReporter
 * @param {object}  wdioConf
 * @param {object}  reporterOptions
 * @param {boolean} reporterOptions.captureStandardOutput
 * @param {boolean} reporterOptions.flowId
 * @param {string}  reporterOptions.message
 * @return {wdioTeamcityReporter}
 */
class WdioTeamcityReporter extends WdioReporter {
  constructor(reporterOptions) {
    Object.assign(reporterOptions, {
      captureStandardOutput: typeof reporterOptions.captureStandardOutput === 'boolean'
        ? reporterOptions.captureStandardOutput
        : false,
      flowId: typeof reporterOptions.flowId === 'boolean'
        ? reporterOptions.flowId
        : true,
      name: typeof reporterOptions.message === 'string'
        ? reporterOptions.message
        : '[title]',
      stdout: true,
    });
    super(reporterOptions);
    this.enableRealTimeOutput(reporterOptions);
  }

  enableRealTimeOutput(opts) {
    events.forEach(event => {
      this[event] = (...args) =>
        flow(buildFormatter(event, opts), msg => {
          if (msg) {
            this.write(msg);
          }
        })(...args);
    });
  }
}

module.exports.default = WdioTeamcityReporter;
module.exports.reporterName = 'teamcity';
