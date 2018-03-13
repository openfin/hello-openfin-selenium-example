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
it does not have access.   Moving forward, we will improve how Chromedriver controls OpenFin Runtime in the future release.

In Summary
* Tests must target specific windows
* OpenFin RunTime must be shut down after a test is completed

### Prerequisites
1. Install [Chrome driver](https://sites.google.com/a/chromium.org/chromedriver/) 
2. Install Node.js
3. Download/clone this repository and `cd` into it
4. Install all the dependencies    
 ```bash
 npm install
 ```
5. Globally install Mocha test framework
 ```bash
 npm install -g mocha
 ```
6. Globally install grunt command line interface
 ```bash
 npm install -g grunt-cli
 ```
7. Install Hello OpenFin app from https://openfin.co/demos/

### Usage
The following steps will help you run tests:
1. Start chromedriver.exe.  You can specify --verbose command line argument to get more loggings.
2. Run all tests
 ```bash
 grunt
 ```  
3. Run the test for one bindings (replace [bindings] with WD, WebDriverIO or WebDriverJs)
 ```bash
 mocha test/[bindings]/Mocha/hello-openfin.js
 ```

## Instructions for Protractor
The example code is written for the Super Calculator Angular demo app that is used in Quick Start of Protractor (http://angular.github.io/protractor/#/).

1. Install Node.js
2. Download/clone this repository and `cd` into it
3. Install all the dependencies
 ```bash
 npm install
 ```
4. Install Protractor
 ```bash
npm install -g protractor
 ```
5. Start chromedriver.exe.  You can specify --verbose command line argument to get more loggings.
6. Host app.json on a web server.  The default is http://localhost:9000/app.json.

7. Run the example
 ```bash
 cd test/protractor
 protractor config.js
 ```

## Instructions for Selenium Server
Two example scripts are included in this project to demonstrate use of Selenium Server.
1. seleniumHub.bat/sh for launching Selenium Grid hub.
2. seleniumNode.bat for launching Selenium Grid node.

config.js for each test needs to be modified to match IP and port of Selenium hub.

## Disclaimers
* This is a starter example and intended to demonstrate to app providers a sample of how to approach an implementation. 
* This is an open source project and all are encouraged to contribute.

## Support
Please enter an issue in the repo for any questions or problems. 
<br> Alternatively, please contact us at support@openfin.co
