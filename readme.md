wdio-teamcity-reporter
======================

WebdriverIO Teamcity reporter which makes it possible to display test results in real-time, makes test information available on the Tests tab of the Build Results page.


## Installation

```bash
npm install wdio-teamcity-reporter --save-dev
```

Instructions on how to install WebdriverIO can be found here: http://webdriver.io/guide/getstarted/install.html


## Configuration

Add reporter in your [wdio.conf.js](http://webdriver.io/guide/testrunner/configurationfile.html) file:

```javascript
exports.config = {
  // ...
  reporters: ['teamcity'],
  // ...
}
```


## Links

- Reference to the Teamcity documentation about reporting messages: https://confluence.jetbrains.com/display/TCD65/Build+Script+Interaction+with+TeamCity


## License

> The MIT License
