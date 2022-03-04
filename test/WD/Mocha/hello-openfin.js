/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and Wd (http://admc.io/wd/)
 * ChromeDriver must be running before test.
 *
 */

"use strict";

var url = require('url');
var chaiAsPromised = require("chai-as-promised");
var chai = require('chai');
chai.use(chaiAsPromised);
var should = chai.should();
var spawn = require('child_process').spawn;

var wd = require('wd');
// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var config = require("../../config");


describe('Hello OpenFin App testing with WD', function() {
    var client;

    this.timeout(config.testTimeout);

    before(function() {
        if (config.desiredCapabilities.chromeOptions.debuggerAddress) {
            // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
            // it needs to start separately
            spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
        }

        // configure webdriver
        client = wd.promiseChainRemote(url.parse(config.remoteDriverUrl));
        return client.init(config.desiredCapabilities)
        .setImplicitWaitTimeout(config.testTimeout)
        .setAsyncScriptTimeout(config.testTimeout)
        .setPageLoadTimeout(config.testTimeout);
    });

    after(function(done) {
        // needs "done" here to give time to run .quit()
        setTimeout(function() {
            client.quit(function() {
                done();
            });
        }, 2000);
    });

    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        client.window(windowHandle, function(err) {
            if (err) {
                callback(undefined);
            } else {
                client.title(function (err, result) {
                    if (err) {
                        callback(undefined);                    
                    } else {
                        callback(result);                    
                    }
                });
            }
        });
    }

    /**
     * Select the window with specified title
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        client.windowHandles(function(err, handles) {
            should.not.exist(err);
            var handleIndex = 0;
            var checkTitle = function (title) {
                if (title === windowTitle) {
                    done();
                } else {
                    handleIndex++;
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
     *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
     *
    **/
    function checkFinGetVersion(callback) {
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) { callback(true); } else { callback(false); }", function(err, result) {
            if (err) {
                callback(false);
            } else {
                callback(result);
            }
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
                client.sleep(1000, function(err) {
                    waitForFinDesktop(readyCallback);
                });
            }
        }
        checkFinGetVersion(callback);
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected window.
     * The executed script is assumed to be asynchronous and must signal that is done by invoking the provided callback, which is always
     * provided as the final argument to the function. The value to this callback will be returned to the client.
     *
     * @param script
     * @param resultCallback callback with result of the javascript code
     */
    function executeAsyncJavascript(script, resultCallback) {
        client.executeAsync(script, resultCallback);
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed
     * to be synchronous and the result of evaluating the script is returned to the client.
     *
     * @param script
     * @param resultCallback callback with result of the javascript code
     */
    function executeJavascript(script, resultCallback) {
        client.execute(script, resultCallback);
    }

    it('Switch to Hello OpenFin Main window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin", done);
    });

    it('Wait for OpenFin API ready', function(done) {
        should.exist(client);
        waitForFinDesktop(done);
    });

    it('Verify OpenFin Runtime Version', function(done) {
        should.exist(client);
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "fin.desktop.System.getVersion(function(v) { callback(v); } );", function(err, version) {
            should.not.exist(err);
            should.exist(version);
            // without the sleep here, sometimes the next step does not go through for some reason
            client.sleep(1000, function(err) {
                done();
            });
        });
    });

    it("Click notification button", function(done) {
        should.exist(client);
        client.elementByCss("#desktop-notification").click();
        done();
    });

    it("Click CPU Info button", function(done) {
        should.exist(client);
        client.elementByCss("#cpu-info").click();
        client.sleep(3000, function(err) {
            done();
        });
    });


    it('Switch to CPU Info window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin CPU Info", done);
    });


    it("Click CPU Info Exit button", function() {
        should.exist(client);
        client.elementByCss("#close-app").click();
    });

    it('Exit OpenFin Runtime', function (done) {
        should.exist(client);
        executeJavascript("fin.desktop.System.exit();", function () {
            done();
        });
    });
});
