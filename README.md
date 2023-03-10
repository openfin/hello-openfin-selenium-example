# Hello OpenFin Selenium Example

## Overview
Included in this repository are simple example tests for the 'Hello OpenFin' app using the popular WebDriver JS Bindings, test frameworks and assertion libraries.  
We have modified the latest Chrome driver to work with OpenFin Runtime.

Examples for the following WebDriver JS Bindings are included in this project: 
1. [WebDriverJs / Selenium-WebDriver](http://www.seleniumhq.org/): test/WebDriverJs/Mocha
2. [WebDriverIO](http://webdriver.io/): test/WebDriverIO/Mocha
3. [WD](http://admc.io/wd/): test/WD/Mocha
4. [Protractor](http://angular.github.io/protractor/#/): test/protractor

### Guidelines
Since all HTML5 applications in the OpenFin environment need to be started with OpenFin API, chromeDriver.get(URL) is not supported.

ChromeDriver, by default, starts Chrome browser with various Chrome arguments, including remote debugging port, before running tests.  ChromeOptions.setBinary needs to be called so ChromeDriver can start OpenFin Runtime properly.  RunOpenFin.bat is an example batch file that can be set as 'binary'.

Given there can be multiple applications/windows active in OpenFin Runtime, tests must begin by selecting the targeted window.  Each test script has a function that
selects the window by matching it's title.

Since the OpenFin Runtime is started by OpenFinRVM, Chromedriver does not have direct control of the OpenFin Runtime.  Chromedriver must be started before any test runs.
Once a test is complete, it needs to shut down OpenFin Runtime by running javascript code "fin.desktop.System.exit();".  driver.quit() does not shut down OpenFin Runtime since
it does not have access.

In Summary
* Tests must target specific windows
* OpenFin RunTime must be shut down after a test is completed

### Prerequisites
1. Install Node.js
2. Download/clone this repository and `cd` into it
3. Install all the dependencies    
 ```bash
 npm install
 ```
4. For Windows, install [Hello OpenFin](https://install.openfin.co/download/?config=https%3A%2F%2Fcdn.openfin.co%2Fdemos%2Fhello%2Fapp.json&fileName=HelloOpenFin&supportEmail=support%40openfin.co) App
5. For Mac, install OpenFin CLI
 ```bash
 npm install -g openfin-cli
 ```

### Usage
The following steps will help you run tests:
1. Start chromedriver.exe.  You can specify --verbose command line argument to get more loggings.
2. Host test/app.json in a webserver, such as localhost:8000, and update test/config.js with the correct URL.
3. Run the test for one bindings (replace [bindings] with WD, WIO or WJS)
 ```bash
 npm run test[bindings]
 ```

## Instructions for Protractor
The example code is written for the Super Calculator Angular demo app that is used in Quick Start of Protractor (http://angular.github.io/protractor/#/).

1. Install Node.js
2. Download/clone this repository and `cd` to test/protractor directory
3. Install all the dependencies
 ```bash
 npm install
 ```
4. Start chromedriver.exe.  You can specify --verbose command line argument to get more loggings.
5. Host protractor/app.json on a web server.  The default is http://localhost:9000/app.json.

6. Run the example
 ```bash
 npm run test
 ```

## Instructions for Selenium Server
Two example scripts are included in this project to demonstrate use of Selenium Server.
1. seleniumHub.bat/sh for launching Selenium Grid hub.
2. seleniumNode.bat for launching Selenium Grid node.

config.js for each test needs to be modified to match IP and port of Selenium hub.

## Disclaimers
* This is a starter example and intended to demonstrate to app providers a sample of how to approach an implementation. 
* This is an open source project and all are encouraged to contribute.
* As of runtime 29+,  a new, single renderer process can appear if using view visibility settings in platfowm windows. This process will always have the URL `openfin://blank` and can be filtered out if desired.

## License
MIT

The code in this repository is covered by the included license.

However, if you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are covered by OpenFin’s Developer, Community, and Enterprise licenses. You can learn more about OpenFin licensing at the links listed below or just email us at support@openfin.co with questions.

https://openfin.co/developer-agreement/ <br/>
https://openfin.co/licensing/


## Support
Please enter an issue in the repo for any questions or problems. 
<br> Alternatively, please contact us at support@openfin.co
