const teamcity = require('../').default;

exports.config = {
  specs: [__dirname + '/e2e/*.js'],

  capabilities: [{
    maxInstances: 2,
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['headless', 'disable-gpu'],
    },
  }],

  sync: true,
  logLevel: 'trace',
  coloredLogs: true,
  screenshotPath: 'shots',
  specFileRetries: 1,
  waitforTimeout: 10000,
  connectionRetryTimeout: 30000,
  framework: 'mocha',
  outputDir: __dirname,
  reporters: [
    [
      teamcity, {
        captureStandardOutput: false,
        flowId: true,
        message: '[browser] / [title]', // [browser] [title]
      },
    ],
  ],

  mochaOpts: {
    timeout: 60000,
    ui: 'tdd',
  },

  services: ['selenium-standalone'],
};

