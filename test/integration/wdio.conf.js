'use strict';

const teamcity = require('../../');

exports.config = {
  specs: ['./test/integration/*.js'],

  maxInstances: 2,

  capabilities: [{
    maxInstances: 2,
    browserName: 'firefox',
  }],

  sync: true,

  logLevel: 'silent',

  coloredLogs: true,

  screenshotPath: 'shots',

  waitforTimeout: 10000,

  connectionRetryTimeout: 30000,

  framework: 'mocha',

  reporters: [teamcity],

  reporterOptions: {
    flowId: false,
    message: '[browser]/[title]', // [browser] [title] [hash]
  },

  mochaOpts: {
    timeout: 60000,
    ui: 'tdd',
  },
};
