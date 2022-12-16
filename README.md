wdio-teamcity-reporter [![Test](https://github.com/webdriverio-community/wdio-teamcity-reporter/actions/workflows/test.yaml/badge.svg?event=push)](https://github.com/webdriverio-community/wdio-teamcity-reporter/actions/workflows/test.yaml) ![npm](https://img.shields.io/npm/dm/wdio-teamcity-reporter)
======================

WebdriverIO Teamcity reporter which makes it possible to display test results in real-time, makes test information available on the Tests tab of the Build Results page.


## Installation

```bash
npm install wdio-teamcity-reporter --save-dev
```

Instructions on how to install WebdriverIO can be found here: https://webdriver.io/docs/gettingstarted


## Configuration

Add reporter in your [wdio.conf.js](http://webdriver.io/guide/testrunner/configurationfile.html) file:

```javascript
exports.config = {
  // ...
  reporters: [
    [
      'teamcity',
      {
        captureStandardOutput: false, // optional
        flowId: true, // optional
        message: '[title]', // optional
      }
    ]
  ],
  // ...
}
```

### Options

- `captureStandardOutput (boolean)` — if `true`, all the standard output (and standard error) messages received between `testStarted` and `testFinished` messages will be considered test output. The default value is `false` and assumes usage of testStdOut and testStdErr service messages to report the test output. Default `false`.
- `flowId (boolean)` — if `true`, `flowId` property will be added to all messages. Flow tracking is necessary for example to distinguish separate processes running in parallel. Default `true`.
- `message (string)` — possibility to provide particular format for the name property. Possible keys: `[browser]`, `[title]`. Example, `[browser] / [title]`. Default `[title]`.


## Links

- Reference to the Teamcity documentation about reporting messages: https://confluence.jetbrains.com/display/TCD65/Build+Script+Interaction+with+TeamCity
- Teamcity testdrive: https://blog.jetbrains.com/teamcity/2019/08/getting-started-with-teamcity-testdrive/


## License

> The MIT License
