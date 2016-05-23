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

const { camelCase, get, isUndefined } = require('lodash');

const paths = {
  browser: '{runner.0.browserName}',
  details: '{err.stack}',
  flowId: '{specHash}',
  hash: '{specHash}',
  message: '{err.message}',
  title: '{title}',
};

const patterns = {
  // 'start'
  'suite:start': {
    messageName: 'testSuiteStarted',
    props: ['name'],
  },
  'test:start': {
    messageName: 'testStarted',
    props: ['name', 'captureStandardOutput'],
  },
  'test:end': {
    messageName: 'testFinished',
    props: ['name'],
  },
  'test:fail': {
    messageName: 'testFailed',
    props: ['name', 'message', 'details'],
  },
  'test:pending': {
    messageName: 'testIgnored',
    props: ['name', 'message'],
  },
  'suite:end': {
    messageName: 'testSuiteFinished',
    props: ['name'],
  },
  // 'end'
};

exports.escape = escape;
exports.events = Object.keys(patterns);
exports.formatterForEvent = formatterForEvent;
exports.formatProps = formatProps;
exports.patterns = patterns;

/**
 * @param  {string}  eventName
 * @param  {object}  opts
 * @param  {boolean} opts.captureStandardOutput
 * @param  {boolean} opts.flowId
 * @param  {string}  opts.name
 * @return {function}
 */
function formatterForEvent(eventName, opts = {}) {
  const pattern = patterns[eventName];
  const props = opts.flowId
    ? ['flowId'].concat(pattern.props)
    : pattern.props;

  const msg = `##teamcity[${pattern.messageName} ${formatProps(props, eventName, opts)}]`;

  formatter.displayName = camelCase(eventName + 'Formatter');
  function formatter(suite) {
    return msg.replace(/{([a-z0-9\.]+)}/gi, (m, g) => escape(get(suite, g, '')));
  }

  return formatter;
}

/**
 * @param  {string[]} props
 * @param  {object} opts
 * @param  {object} opts.captureStandardOutput
 * @param  {string} opts.name
 * @return {string}
 */
function formatProps(props, eventName, opts) {
  return props.map(prop => formatProp(prop, eventName, opts)).join(' ');
}

/**
 * @param  {string} prop
 * @param  {object} opts
 * @param  {object} opts.captureStandardOutput
 * @param  {string} opts.name
 * @return {string}
 */
function formatProp(prop, eventName, opts) {
  var value = '';

  switch (prop) {
  case 'captureStandardOutput':
    value = String(opts.captureStandardOutput);
    break;

  case 'message':
    value = eventName === 'test:pending'
      ? 'pending'
      : paths[prop];
    break;

  case 'name':
    value = opts[prop].replace(/\[([a-z]+)\]/gi, (m, g) => paths[g]);
    break;

  default:
    value = paths[prop];
  }

  return `${prop}='${value}'`;
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
    .replace(/'/g, '|\'')
    .replace(/\n/g, '|n')
    .replace(/\r/g, '|r')
    .replace(/\u(\d{4})/g, '|0x$1')
    .replace(/\|/g, '||')
    .replace(/\[/g, '|[')
    .replace(/\]/g, '|]');
}
