'use strict'

const teamcity = require('../../').default
const { TEST_USER, TEST_KEY } = process.env

exports.config = {
  specs: ['./test/integration/*.js'],

  user: TEST_USER,
  key: TEST_KEY,

  capabilities: [
    {
      maxInstances: 2,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['headless', 'disable-gpu']
      }
    }
  ],

  sync: true,

  logLevel: 'silent',

  coloredLogs: true,

  screenshotPath: 'shots',

  specFileRetries: 1,

  waitforTimeout: 10000,

  connectionRetryTimeout: 30000,

  framework: 'mocha',

  reporters: [[teamcity, {
    captureStandardOutput: false,
    flowId: true,
    message: '[browser] / [title]' // [browser] [title]
  }]],

  mochaOpts: {
    timeout: 60000,
    ui: 'tdd'
  },

  // keep in mind that java runtime is required to make this one work.
  // in case you have any trouble, try to follow install instructions
  // from selenium-standalone package, see https://www.npmjs.com/package/selenium-standalone
  services: ['selenium-standalone']
}
