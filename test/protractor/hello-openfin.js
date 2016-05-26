/**
 *
 * Example test script for Super Calculator (http://juliemr.github.io/protractor-demo/index.html) using Protractor.
 * ChromeDriver must be running before test.
 *
 */

describe('OpenFin App testing with protractor', function() {
	"use strict";

	var driver;

    beforeEach(function () {
    	// get instance of WebDriver so can access it directly.  browser is a wrapper
    	// driver should used to avoid timeout from waitForAngular
    	driver = browser.driver;    	
	});

	afterEach(function() {
	});

    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        driver.switchTo().window(windowHandle).then(function () {
            driver.getTitle().then(function (title) {
                callback(title);
            });
        });
    }

    /**
     * Select the window with specified title.
     *
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        driver.getAllWindowHandles().then(function (handles) {
            var handleIndex = 0,
                checkTitle = function (title) {
                if (title === windowTitle) {
                        done();
                } else {
                    handleIndex += 1;
                    if (handleIndex < handles.length) {
                        switchWindow(handles[handleIndex], checkTitle);
                    } else {
                        // the window may not be loaded yet, so call itself again
                        switchWindowByTitle(windowTitle, done);
                    }
                }
            };
            switchWindow(handles[handleIndex], checkTitle);
        });
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected window.
     * The executed script is assumed to be asynchronous and must signal that is done by invoking the provided callback, which is always
     * provided as the final argument to the function. The value to this callback will be returned to the client.
     *
     * @param script
     * @returns {*|!webdriver.promise.Promise.<T>}
     *
     */
    function executeAsyncJavascript(script) {
        return driver.executeAsyncScript(script);
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed
     * to be synchronous and the result of evaluating the script is returned to the client.
     *
     * @param script
     * @returns {*|!webdriver.promise.Promise.<T>}
     */
    function executeJavascript(script) {
        return driver.executeScript(script);
    }

    /**
     *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
     *
    **/
    function checkFinGetVersion(callback) {
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) { callback(true); } else { callback(false); }").then(function(result) {
            callback(result);
        });
    }

    /**
     *  Wait for OpenFin Javascript API to be injected 
     *
    **/
    function waitForFinDesktop(readyCallback) {
        var callback = function(ready) {
            if (ready === true) {
                readyCallback();
            } else {
                client.sleep(1000, function() {
                    waitForFinDesktop(readyCallback);
                });
            }
        }
        checkFinGetVersion(callback);
    }


    it('Switch to App Main window', function(done) {
        expect(driver).toBeDefined();
        switchWindowByTitle("Super Calculator", done);
    });

    it('Wait for OpenFin Java adapter ready', function(done) {
        expect(driver).toBeDefined();
        waitForFinDesktop(done);
    });

    it('Verify OpenFin Runtime Version', function (done) {
        expect(driver).toBeDefined();
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.System.getVersion(function(v) { callback(v); } );").then(function(v) {
            expect(v).toEqual("6.49.11.73");
                done();
            });
    });


    it("Do 1 + 2", function () {
	    element(by.model('first')).sendKeys(1);
	    element(by.model('second')).sendKeys(2);
	    element(by.id('gobutton')).click();
	    expect(element(by.binding('latest')).getText()).
	        toEqual('3'); 
    });

    it('Exit OpenFin Runtime', function (done) {
        expect(driver).toBeDefined();
        executeJavascript("fin.desktop.System.exit();").then(function () {
            done();
        });
    });



});