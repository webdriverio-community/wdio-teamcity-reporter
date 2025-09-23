const WdioReporter = require('@wdio/reporter').default;
const assert = require('assert');
const path = require('node:path');

/**
 * @typedef {Object} SuiteStats
 * @property {string} type
 * @property {string} start
 * @property {string} uid
 * @property {string} cid
 * @property {string} title
 * @property {string} fullTitle
 * @property {undefined} tags
 * @property {Array} tests
 * @property {Array} hooks
 * @property {Array} suites
 * @property {Array} hooksAndTests
 */

/**
 * @typedef {Object} TestStats
 * @property {string} type
 * @property {string} start
 * @property {number} _duration
 * @property {string} uid
 * @property {string} cid
 * @property {string} title
 * @property {string} fullTitle
 * @property {Array} output
 * @property {any} argument
 * @property {string} state
 * @property {string} [end]
 */

/**
 * @typedef {Object} HookStats
 * @property {string} type
 * @property {string} start
 * @property {number} _duration
 * @property {string} uid
 * @property {string} cid
 * @property {string} title
 * @property {string} fullTitle
 * @property {Array} output
 * @property {any} argument
 * @property {string} state
 * @property {string} [end]
 */

class WdioTeamcityReporter extends WdioReporter {
  static escape(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/\|/g, '||')
      .replace(/\n/g, '|n')
      .replace(/\r/g, '|r')
      .replace(/\[/g, '|[')
      .replace(/]/g, '|]')
      .replace(/\u0085/g, '|x') // next line
      .replace(/\u2028/g, '|l') // line separator
      .replace(/\u2029/g, '|p') // paragraph separator
      .replace(/'/g, '|\'');
  }

  static bool(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
  }

  static number(value, fallback) {
    return typeof value === 'number' ? value : fallback;
  }

  static string(value, fallback) {
    return typeof value === 'string' ? value : fallback;
  }

  constructor(reporterOptions) {
    const r = WdioTeamcityReporter;
    const params = {
      captureStandardOutput: r.bool(reporterOptions.captureStandardOutput, false),
      flowId: r.bool(reporterOptions.flowId, true),
      message: r.string(reporterOptions.message, '[title]'),
      stdout: true,
      writeStream: process.stdout,
    };
    const options = Object.assign(reporterOptions, params);

    super(options);
    this.currentFile = null;
    this.currentFileRelative = null;
  }

  /**
   * @param {SuiteStats} suiteStats
   */
  onSuiteStart(suiteStats) {
    this.currentFile = suiteStats.file;
    // Add locationHint to the testSuiteStarted message
    this._m('##teamcity[testSuiteStarted name=\'{name}\' locationHint=\'{location}\' flowId=\'{id}\']', suiteStats);
  }

  /**
   * @param {TestStats} testStats
   */
  onTestStart(testStats) {
    if (testStats.retries > 0) {
      // This is a retry. Mark the previous, failed attempt as 'failed' so that users can see that there are retries.
      this._m('##teamcity[testIgnored name=\'{name}\' message=\'Failed and retried\' flowId=\'{id}\']', testStats);
    }
    // Use a generic {location} placeholder to handle encoding centrally in _m
    this._m('##teamcity[testStarted name=\'{name}\' locationHint=\'{location}\' captureStandardOutput=\'{capture}\' flowId=\'{id}\']', testStats);
  }

  /**
   * @param {TestStats} testStats
   */
  onTestEnd(testStats) {
    if (testStats.state === 'skipped') return;
    this._m('##teamcity[testFinished name=\'{name}\' duration=\'{ms}\' flowId=\'{id}\']', testStats);
  }

  /**
   * @param {TestStats} testStats
   */
  onTestFail(testStats) {
    const {escape, number} = WdioTeamcityReporter;
    const specFileRetryAttempts = number(this.runnerStat.config.specFileRetryAttempts, 0);
    const specFileRetries = number(this.runnerStat.config.specFileRetries, 0);
    const attempt = escape(`${specFileRetryAttempts}/${specFileRetries}`);
    const stackLocation = this._parseStack(testStats.error.stack);
    // Use precise failure line from stack if possible, otherwise fall back to the test definition location.
    const locationAttr = stackLocation ? `locationHint='file://${stackLocation}'` : 'locationHint=\'{location}\'';

    if (specFileRetryAttempts === specFileRetries) {
      this._m(`##teamcity[testFailed name='{name}' message='{error}' details='{stack}' ${locationAttr} flowId='{id}']`, testStats);
    } else {
      this._m(`##teamcity[message name='{name}' text='attempt ${attempt} failed: {error}' flowId='{id}']`, testStats);
    }
  }

  /**
   * @param {HookStats} hookStats
   */
  onHookEnd(hookStats) {
    if (hookStats.state === 'failed') {
      const stackLocation = this._parseStack(hookStats.error.stack);
      const locationAttr = stackLocation ? `locationHint='file://${stackLocation}'` : '';
      this._m(`##teamcity[testFailed name='{name}' message='{error}' details='{stack}' ${locationAttr} flowId='{id}']`, hookStats);
    }
  }

  /**
   * @param {TestStats} testStats
   */
  onTestSkip(testStats) {
    this._m('##teamcity[testIgnored name=\'{name}\' message=\'skipped\' flowId=\'{id}\']', testStats);
  }

  /**
   * @param {SuiteStats} suiteStats
   */
  onSuiteEnd(suiteStats) {
    const pendingTests = Object.values(this.suites[suiteStats.uid].tests).filter(test => test.state === 'pending');
    pendingTests.forEach(testStat => {
      this._m('##teamcity[testIgnored name=\'{name}\' message=\'skipped\' flowId=\'{id}\']', testStat);
    });

    this._m('##teamcity[testSuiteFinished name=\'{name}\' flowId=\'{id}\']', suiteStats);
    this.currentFile = null;
  }

  /**
   * @param {string} template
   * @param {TestStats | SuiteStats} stats
   */
  _m(template, stats) {
    assert(stats != null, '_m(): missing stats argument');

    if (!this.options.flowId) {
      template = template.replace(/ flowId='\{id}'/g, '');
    }
    template = template.replace(/ locationHint=''/g, '').replace(/ \s*>/, '>');

    const fragment = pattern => {
      switch (pattern) {
      case '{capture}':
        return this.options.captureStandardOutput ? 'true' : 'false';
      case '{id}':
        return this.runnerStat.sessionId + '/' + stats.cid;
      case '{ms}':
        return stats._duration;
      case '{location}': {
        if (this.currentFile) {
          const relativeFilePath = path.relative(process.cwd(), this.currentFile);
          if (stats.fullTitle) {
            // URL-encode the fragment part of the URI to handle spaces and special chars
            const encodedTitle = encodeURIComponent(stats.fullTitle);
            return `wdio://${relativeFilePath}#${encodedTitle}`;
          }
          return `file://${relativeFilePath || ''}`; // Fallback
        }
        return '';
      }
      case '{name}': {
        let name = this.options.message;
        if (name.includes('[browser]')) name = name.replace(/\[browser]/g, this._v());
        if (name.includes('[title]')) name = name.replace(/\[title]/g, stats.title);
        return name;
      }
      case '{state}':
        return stats.state;
      case '{error}':
        return stats.error ? stats.error.message : '';
      case '{stack}':
        return stats.error ? stats.error.stack : '';
      default:
        return '';
      }
    };

    const m = template.replace(/\{[a-z]+}/gi, m => WdioTeamcityReporter.escape(fragment(m)));

    this.write(m + '\n');
  }

  _parseStack(stack) {
    if (!stack || !this.currentFile) return null;
    const escapedFile = this.currentFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stackLineRegex = new RegExp(`(${escapedFile}:\\d+:\\d+)`);
    const match = stack.match(stackLineRegex);

    return match ? match[1] : null;
  }

  _v() {
    // @see https://github.com/webdriverio/webdriverio/blob/v6.10.5/packages/webdriver/src/types.ts#L215
    const {browserName, browserVersion, version} = this.runnerStat.capabilities;
    return `${browserName} ${browserVersion || version}`;
  }
}

module.exports.default = WdioTeamcityReporter;
module.exports.reporterName = 'teamcity';
