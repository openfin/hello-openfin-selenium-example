/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and WebdriverIO (http://webdriver.io)
 * ChromeDriver must be running before test.
 *
 */

"use strict";

var should = require('chai').should(),
    webdriver = require('webdriverio'),
    assert = require("assert"),
    config = require("../../config"),
    spawn = require('child_process').spawn;


describe('Hello OpenFin App testing with webdriver.io', function() {
    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function() {
        if (process.platform === 'win32') {
            var args = ['/c', config.desiredCapabilities.chromeOptions.binary].concat(config.desiredCapabilities.chromeOptions.args);
            spawn('cmd.exe', args);
        } else {
            spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
        }

        // configure webdriver
        var driverOptions = {
            desiredCapabilities: config.desiredCapabilities,
            host: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.testTimeout,
            logLevel: 'debug'
        };
        client = webdriver.remote(driverOptions).init();
        client.timeoutsImplicitWait(config.testTimeout);
        client.timeoutsAsyncScript(config.testTimeout);
        client.timeouts("page load", config.testTimeout);
        if (!config.remoteDriverPath) {
            client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
        }
    });

    after(function(done) {
        // needs "done" here to give time to run .end()
        client.end(function() {
            done();
        });
    });


    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        client.switchTab(windowHandle, function(err) {
            client.title(function (err, result) {
                if (err) {
                    callback(undefined);
                } else {
                    callback(result.value);
                }
            });
        });
    }

    /**
     * Select the window with specified title
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        client.getTabIds(function (err, handles) {
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
                callback(result.value);
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
                client.pause(1000, function() {
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

    it('Wait for OpenFin Java adapter ready', function(done) {
        should.exist(client);
        waitForFinDesktop(done);
    });

    it('Verify OpenFin Runtime Version', function(done) {
        should.exist(client);
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "fin.desktop.System.getVersion(function(v) { callback(v); } );", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            result.value.should.equal(config.expectedRuntimeVersion);
            // without the sleep here, sometimes the next step does not go through for some reason
            client.pause(1000, function() {
                done();
            });
        });
    });

    it("Find notification button", function(done) {
        should.exist(client);
        client.element("#desktop-notification", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            notificationButton = result.value;
            done();
        });
    });

    it("Click notification button", function(done) {
        should.exist(client);
        should.exist(notificationButton);
        client.elementIdClick(notificationButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            done();
        });
    });


    it("Find CPU Info button", function(done) {
        should.exist(client);
        client.element("#cpu-info", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            cpuInfoButton = result.value;
            done();
        });
    });

    it("Click CPU Info button", function(done) {
        should.exist(client);
        should.exist(cpuInfoButton);
        client.elementIdClick(cpuInfoButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            client.pause(3000, function() {
                done();
            });
        })
    });

    it('Switch to CPU Info window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin CPU Info", done);
    });


    it("Find Exit button for CPU Info window", function(done) {
        should.exist(client);
        client.element("#close-app", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            cpuInfoExitButton = result.value;
            done();
        });


    });

    it("Click CPU Info Exit button", function(done) {
        should.exist(client);
        should.exist(cpuInfoExitButton);
        client.elementIdClick(cpuInfoExitButton.ELEMENT, function(err, result) {
            should.not.exist(err);
            done();
        })
    });

    it('Exit OpenFin Runtime', function (done) {
        should.exist(client);
        executeJavascript("fin.desktop.System.exit();", function () {
            done();
        });
    });


});
