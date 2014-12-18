hello-openfin-Selenium
===========================
Examples of simple tests for Hello OpenFin app using popular WebDriver JS Bindings, test frameworks and assertion libraries.  

We have modified the latest Chrome driver to work with OpenFin runtime.  A copy of this version of chromedriver.exe is included in this project.

Examples for the following WebDriver JS Bindings are included in this project:
 
1. [WebDriverJs / Selenium-WebDriver](http://www.seleniumhq.org/)
2. [WebDriverIO*](http://webdriver.io/)
3. [WD*](http://admc.io/wd/)

## Prerequisites

1. Install Node.js
2. Download/clone this repository and `cd` into it
3. Install all the dependencies    
 ```bash
 npm install
 ```
 
3. Globally install Mocha test framework
 ```bash
 npm install -g mocha
 ```

4. Install Hellp OpenFin app from http://www.openfin.co/app-gallery.html

## Usage

The following steps will help you run tests with our recommended testing tools:

1. Start Hello OpenFin app

2. Start chromedriver.exe located in root directory of this project

3. Run the all tests
 ```bash
 grunt
 ```
  
4. Run the test for one bindings
 ```bash
 mocha test/bindings/hello-openfin.js
 ```

## Testing Tools Used

**WebDriver JS Bindings**

1. [WebDriverJs / Selenium-WebDriver](http://www.seleniumhq.org/)
2. [WebDriverIO*](http://webdriver.io/)
3. [NightwatchJs*](http://nightwatchjs.org/)
4. [WD*](http://admc.io/wd/)  
\* *needs Selenium Standalone Server running*

**Test Frameworks**

1. [Mocha](http://mochajs.org/)
2. [Jasmine](http://jasmine.github.io/1.3/introduction.html) with [Jasmine-Node](https://github.com/mhevery/jasmine-node)
3. [QUnit](http://qunitjs.com/)

**Assertion Libraries**

1. [Chai](http://chaijs.com/)
2. [Chai-As-Promised](http://chaijs.com/plugins/chai-as-promised)
2. [Should](https://github.com/shouldjs/should.js)

## Grunt
Default task will run tests from our 'recommended' folder. After the initial run, it will watch for changes and run tests from the file that was changed.

To run this grunt task, do the following:

1. Globally install grunt command line interface
 ```bash
 npm install -g grunt-cli
 ```

2. Run the task with grunt
 ```bash
 grunt
 ```

## Tips, Suggestions and Information

* [Full WebDriver JSON Wire Protocol](https://github.com/admc/wd/blob/master/doc/jsonwire-full-mapping.md)
* **Mocha**: Pass in 'done' callback into tests if you are not returning a promise and call (`done()` or `.call(done)` or equivalent) where you want to indicate that the test has finished
* **Mocha**: version 1.18.0 and up supports promises natively, so use it if you can
* **Mocha, WD**: Make use of promises and chaining supported by Mocha and WD to write cleaner tests.
Take a look at the comparison of writing tests with and without promises and chaining in the file: WD/Mocha/tests.js
* **WD**: to enable Chai assertion chaining, add this in your tests:

 ```js
 chaiAsPromised.transferPromiseness = wd.transferPromiseness;
 ```
 
 This will let you chain commands after assertions:
 ```js
 .elementByCssSelector('#element1')
 .text().should.become('Text from element 1')
 .elementByCssSelector('#element2')
 .text().should.become('Text from element 2')
 ```
* **WD**: the following is an example of how you can add your own custom methods:

 ```js
 wd.addPromiseChainMethod('clickOn', function(selector) {
	    return this.elementByCss(selector).click();
 });
 ```
 so that you can use it in your tests:

 ```js
 it('can use my own custom method', function() {
	    return browser.get(someUrl).clickOn('#button1');
 });
 ``` 
* **WD-Helper**: a library that adds useful custom methods for WD on top of what WD already offers. After requiring it, tests can use native WD methods, as well as custom methods from the library

## Versions

List of the tools and their versions used as of writing example tests:

* Selenium-Webdriver: 2.44.0
* Webdriverio: 2.3.0
* WD: 0.3.10
* WD-Helper: 0.2.0
* Mocha: 2.0.1
* QUnit: 0.7.5
* Chai: 1.9.2
* Chai-as-Promised: 4.1.1
* Should: 4.1.0
* Grunt: 0.4.5
* Grunt-Clear: 0.2.1
* Grunt-Contrib-Watch: 0.6.1
* Grunt-Mocha-Test: 0.12.2
* Load-Grunt-Tasks: 1.0.0