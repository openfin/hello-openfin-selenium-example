hello-openfin-Selenium
===========================
Examples of simple tests for Hello OpenFin app using popular WebDriver JS Bindings, test frameworks and assertion libraries.  

We have modified the latest Chrome driver to work with OpenFin runtime.  A copy of this version of chromedriver.exe is included in this project.

Examples for the following WebDriver JS Bindings are included in this project:
 
1. [WebDriverJs / Selenium-WebDriver](http://www.seleniumhq.org/): test/WebDriverJs/Mocha
2. [WebDriverIO*](http://webdriver.io/): test/WebDriverIO/Mocha
3. [WD*](http://admc.io/wd/): test/WD/Mocha

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

3. Run the all tests
 ```bash
 grunt
 ```
  
4. Run the test for one bindings (replace [bindings] with WD, WebDriverIO or WebDriverJs)
 ```bash
 mocha test/[bindings]/Mochahello-openfin.js
 ```

