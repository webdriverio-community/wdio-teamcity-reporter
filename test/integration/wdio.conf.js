'use strict'

const teamcity = require('../../').default

exports.config = {
  specs: ['./test/integration/*.js'],

  capabilities: [{
    maxInstances: 2,
    browserName: 'chrome'
  }],

  sync: true,

  logLevel: 'silent',

  coloredLogs: true,

  screenshotPath: 'shots',

  specFileRetries: 1,

  waitforTimeout: 10000,

  connectionRetryTimeout: 30000,

  framework: 'mocha',

  reporters: [[teamcity, {
    captureStandardOutput: true,
    flowId: true,
    message: '[browser] / [title]' // [browser] [title]
  }]],

  mochaOpts: {
    timeout: 60000,
    ui: 'tdd'
  },

  services: ['selenium-standalone']
}
