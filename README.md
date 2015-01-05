hello-openfin-Selenium
===========================
Examples of simple tests for Hello OpenFin app using popular WebDriver JS Bindings, test frameworks and assertion libraries.  

We have modified the latest Chrome driver to work with OpenFin runtime.  A copy of the chromedriver.exe is included in this project.

Examples for the following WebDriver JS Bindings are included in this project:
 
1. [WebDriverJs / Selenium-WebDriver](http://www.seleniumhq.org/): test/WebDriverJs/Mocha
2. [WebDriverIO](http://webdriver.io/): test/WebDriverIO/Mocha
3. [WD](http://admc.io/wd/): test/WD/Mocha

## Guidelines

Since all HTML5 applications in OpenFin environment need to be started with OpenFin API, chromeDriver.get(URL) is not supported.  Test code needs to provides
OpenFinRVM and HTML5 app configuration to Chromedriver so it can start OpenFin Runtime and the html5 application before tests can run.  HelloOpenFinTest.main
accepts arguments for location of OpenFinRVM and URL of configuration file for Hello OpenFin app.

Since there are always multiple applications/windows active in OpenFin Runtime, any test needs to first select the window that is being targeted.  HelloOpenFinTest.switchWindow
method selects the window by matching its title.

Since OpenFin Runtime is started by OpenFinRVM, Chromedriver does not have direct control of OpenFin Runtime.  Chromedriver must be started before any test runs.
Once test is complete, it needs to shut down OpenFin Runtime by running javascript code "fin.desktop.System.exit();".  driver.quit() does not shut down OpenFin Runtime since
it does not have access.   We will improve how Chromedriver controls OpenFin Runtime in the future release.

## Prerequisites

1. Install Node.js

2. Download/clone this repository and `cd` into it

3. Install all the dependencies    
 ```bash
 npm install
 ```
 
4. Globally install Mocha test framework
 ```bash
 npm install -g mocha
 ```

5. Globally install grunt command line interface
 ```bash
 npm install -g grunt-cli
 ```

6. Install Hello OpenFin app from http://www.openfin.co/app-gallery.html

## Usage

The following steps will help you run tests:

1. Start Hello OpenFin app

2. Start chromedriver.exe located in root directory of this project

3. Run all tests
 ```bash
 grunt
 ```
  
4. Run the test for one bindings (replace [bindings] with WD, WebDriverIO or WebDriverJs)
 ```bash
 mocha test/[bindings]/Mocha/hello-openfin.js
 ```

