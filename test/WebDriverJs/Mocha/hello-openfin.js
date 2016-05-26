/**
 * Example test script for Hello OpenFin app using Mocha, CHAI and selenium-webdriver (https://www.npmjs.org/package/selenium-webdriver)
 * ChromeDriver must be running before test.
 * 
 */


var expect, until, webdriver, chrome, config;
expect = require('chai').expect;
until = require('selenium-webdriver').until;
webdriver = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
config = require("../../config"),
spawn = require('child_process').spawn;


describe('Hello OpenFin App testing with selenium-webdriver', function () {
    "use strict";

    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function () {
        if (process.platform === 'win32') {
            var args = ['/c', config.desiredCapabilities.chromeOptions.binary].concat(config.desiredCapabilities.chromeOptions.args);
            spawn('cmd.exe', args);
        } else {
            spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
        }

        // configure webdriver
        var capabilities = webdriver.Capabilities.chrome();
        capabilities.set('chromeOptions', config.desiredCapabilities.chromeOptions);
        client = new webdriver.Builder().usingServer(config.remoteDriverUrl).withCapabilities(capabilities).build();
        var timeouts = client.manage().timeouts();
        timeouts.implicitlyWait(config.testTimeout);
        timeouts.pageLoadTimeout(config.testTimeout);
        timeouts.setScriptTimeout(config.testTimeout);
    });

    after(function (done) {
        // needs "done" here to give time to run .end()
        client.quit().then(function () {
            done();
        });
    });

    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        client.switchTo().window(windowHandle).then(function () {
            client.getTitle().then(function (title) {
                callback(title);
            });
        }).then(null, function(e) {
                        // some windows get opened and closed during startup, so not really an error
                        callback("no such window");
                    });
    }

    /**
     * Select the window with specified title.
     *
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        client.getAllWindowHandles().then(function (handles) {
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
        return client.executeAsyncScript(script);
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed
     * to be synchronous and the result of evaluating the script is returned to the client.
     *
     * @param script
     * @returns {*|!webdriver.promise.Promise.<T>}
     */
    function executeJavascript(script) {
        return client.executeScript(script);
    }

    it('Switch to Hello OpenFin Main window', function(done) {
        expect(client).to.exist;
        switchWindowByTitle("Hello OpenFin", done);
    });

    it('Wait for OpenFin Java adapter ready', function(done) {
        expect(client).to.exist;
        waitForFinDesktop(done);
    });

    it('Verify OpenFin Runtime Version', function (done) {
        expect(client).to.exist;
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.System.getVersion(function(v) { callback(v); } );").then(function(v) {
            expect(v).to.equal(config.expectedRuntimeVersion);
                // without the sleep here, sometimes the next step does not go through for some reason
                client.sleep(1000).then(function () {
                    done();
                });
            });
    });


    it("Find notification button", function (done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("desktop-notification")).then(function(result) {
            notificationButton = result[0];
            done();
        });
    });

    it("Click notification button", function (done) {
        expect(client).to.exist;
        expect(notificationButton).to.exist;
        notificationButton.click().then(function () {
            // give time for notification to show up
            client.sleep(2000).then(function () {
                done();
            });
        });
    });


    it("Find CPU Info button", function (done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("cpu-info")).then(function(result) {
            cpuInfoButton = result[0];
            done();
        });
    });

    it("Click CPU Info button", function (done) {
        expect(client).to.exist;
        expect(cpuInfoButton).to.exist;
        cpuInfoButton.click().then(function () {
            // sleep here so CPU Info window stay shown for us to see
            client.sleep(2000).then(function () {
                done();
            });
        });
    });

    it('Switch to CPU Info window', function (done) {
        expect(client).to.exist;
        switchWindowByTitle("Hello OpenFin CPU Info", done);
    });


    it("Find Exit button for CPU Info window", function (done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("close-app")).then(function(result) {
            cpuInfoExitButton = result[0];
            done();
        });
    });

    it("Click CPU Info Exit button", function (done) {
        expect(client).to.exist;
        expect(cpuInfoExitButton).to.exist;
        cpuInfoExitButton.click().then(function() {
            done();
        });
    });

    it('Exit OpenFin Runtime', function (done) {
        expect(client).to.exist;
        executeJavascript("fin.desktop.System.exit();").then(function () {
            done();
        });
    });


});
