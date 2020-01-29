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

  waitforTimeout: 10000,

  connectionRetryTimeout: 30000,

  framework: 'mocha',

  reporters: [[teamcity, {
    flowId: true,
    message: '[browser]/[title]' // [browser] [title] [hash]
  }]],

  mochaOpts: {
    timeout: 60000,
    ui: 'tdd'
  },

  services: ['selenium-standalone']
}
