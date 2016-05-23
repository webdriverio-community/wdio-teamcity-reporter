'use strict';

/**
 * Notes from https://confluence.jetbrains.com/display/TCD9/Build+Script+Interaction+with+TeamCity
 *
 * Nested test reporting:
 *
 * Prior to TeamCity 9.1, one test could have been reported from within another test.
 * Since TeamCity 9.1, starting another test finishes the currently started test in the same "flow".
 * To still report tests from within other tests,
 * you will need to specify another flowId in the nested test service messages.
 *
 *
 * All the other test messages (except for testIgnored) with the same name attribute
 * should appear between the testStarted and testFinished messages (in that order).
 * Currently, the test-related service messages cannot be output with Ant's echo task until flowId attribute is specified.
 */

const { camelCase, get } = require('lodash');

const paths = {
  browser: 'runner.0.browserName',
  details: 'err.stack',
  flowId: 'specHash',
  hash: 'specHash',
  message: 'err.message',
  title: 'title',
};

const events = {
  'suite:start': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\']',
  'test:start': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\' captureStandardOutput=\'[captureStandardOutput]\']',
  'test:end': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\']',
  'test:fail': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\' message=\'[message]\' details=\'[details]\']',
  'test:pending': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\' message=\'pending\']',
  'suite:end': '##teamcity[testSuiteStarted flowId=\'[flowId]\' name=\'[name]\']',
};

exports.buildFormatter = buildFormatter;
exports.escape = escape;
exports.events = Object.keys(events);

/**
 * @param  {string} eventName
 * @param  {object} opts
 * @return {function}
 */
function buildFormatter(eventName, opts) {
  const pattern = updateProps(events[eventName], opts);

  formatter.displayName = camelCase(eventName + 'Formatter');
  return formatter;

  function formatter(suite) {
    return pattern.replace(/\[([a-z]+)\]/gi, (m, g) => formatProp(g, suite));
  }
}

/**
 * Escape the given `str`.
 *
 * @param {string} str
 * @return {string}
 */
function escape(str) {
  if (!str) return '';

  return str
    .toString()
    .replace(/\|/g, '||')
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]')
    .replace(/\u(\d{4})/g, '|0x$1')
    .replace(/'/g, '|\'');
}

/**
 * @param  {string} prop
 * @param  {object} ctx
 * @param  {string} ctx.type
 * @param  {object} [ctx.err] Error object
 * @param  {string} ctx.title
 * @param  {string} ctx.parent
 * @param  {boolean} ctx.pending
 * @param  {string} ctx.file
 * @param  {string[]} ctx.specs
 * @param  {string} ctx.event
 * @param  {object} ctx.runner
 * @param  {object} ctx.runner.0
 * @param  {string} ctx.runner.0.browserName
 * @param  {string} ctx.specHash
 * @return {string}
 */
function formatProp(prop, ctx) {
  var value = get(ctx, paths[prop] || '', '');

  if (prop === 'message') {
    value = value.split('\n')[0];
  }

  return escape(value);
}

/**
 * @param  {string} pattern
 * @param  {object} opts
 * @return {string}
 */
function updateProps(pattern, opts) {
  var result = pattern;

  for (var key in opts) {
    if (key === 'flowId') {
      continue;
    }

    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), String(opts[key]));
  }

  if (!opts.flowId) {
    result = result.replace('flowId=\'[flowId]\' ', '');
  }

  return result;
}
