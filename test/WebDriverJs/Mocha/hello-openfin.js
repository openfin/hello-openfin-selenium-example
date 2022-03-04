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

    before(async function () {
        // configure webdriver
        if (config.desiredCapabilities.chromeOptions.debuggerAddress) {
            // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
            // it needs to start separately
            spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
        }

        const capabilities = webdriver.Capabilities.chrome();
        const  chromeOptions = {
            extensions: [],
            debuggerAddress: config.desiredCapabilities.chromeOptions.debuggerAddress
        };

        capabilities.set('goog:chromeOptions', chromeOptions);
        client = await new webdriver.Builder().usingServer(config.remoteDriverUrl).withCapabilities(capabilities).build();
        var timeouts = await client.manage().getTimeouts();
        timeouts.implicit = config.testTimeout;
        timeouts.pageLoad = config.testTimeout;
        timeouts.script = config.testTimeout;
    });

    after(async function () {
        await client.quit();
    });

    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    async function switchWindow(windowHandle, callback) {
        await client.switchTo().window(windowHandle);
        const title = await client.getTitle();
        callback(title);
    }

    /**
     * Select the window with specified title.
     *
     * @param windowTitle window title
     */
    async function switchWindowByTitle(windowTitle) {
        const handles = await client.getAllWindowHandles();
        let handleIndex = 0;
        let checkTitle = async (title) => {
            if (title !== windowTitle) {
                handleIndex++;
                if (handleIndex < handles.length) {
                    await switchWindow(handles[handleIndex], checkTitle);
                } else {
                    // the window may not be loaded yet, so call itself again
                    await switchWindowByTitle(windowTitle);
                }
            }
        };
        await switchWindow(handles[handleIndex], checkTitle);
    }

    /**
     * Retrieve document.readyState
     * @param callback
     */
    function getDocumentReadyState(callback) {
       executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
           "if (document && document.getElementById) { callback(document.readyState); } else { callback(undefined); }").then(function(result) {
               console.log(result);
               callback(result);
       });
    }

    /**
     *  Wait for document.readyState === 'complete'
     *
    **/
    function waitForDocumentReady(readyCallback) {
        var callback = function(readyState) {
            if (readyState === 'complete') {
                readyCallback();
            } else {
                client.sleep(1000).then(function() {
                    waitForDocumentReady(readyCallback);
                });
            }
        };
        getDocumentReadyState(callback);
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
     * Check if button with id "desktop-notification" is being shown on screen
     */
    async function checkNotificationButton(callback) {
        return  callback(!!(await client.findElement(webdriver.By.id("desktop-notification"))));
    }

    /**
     *  Wait for OpenFin Javascript API to be injected 
     *
    **/
    async function waitForFinDesktop(readyCallback) {
        var callback = async (ready) => {
            if (ready === true) {
                return;
            } else {
                await client.sleep(1000);
                await waitForFinDesktop();
            }
        };
        await checkNotificationButton(callback);
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
    async function executeAsyncJavascript(script) {
        return client.executeAsyncScript(script);
    }

    /**
     * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed
     * to be synchronous and the result of evaluating the script is returned to the client.
     *
     * @param script
     * @returns {*|!webdriver.promise.Promise.<T>}
     */
    async function executeJavascript(script) {
        return client.executeScript(script);
    }

    it('Wait for document ready', function(done) {
        expect(client).to.exist;
        waitForDocumentReady(done);
    });

    it('Switch to Hello OpenFin Main window', async function() {
        expect(client).to.exist;
        await switchWindowByTitle("Hello OpenFin");
    });

    it('Wait for OpenFin API ready', async function() {
        expect(client).to.exist;
        await waitForFinDesktop();
    });

    it('Verify OpenFin Runtime Version', async function () {
        expect(client).to.exist;
        const v = await executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.System.getVersion(function(v) { callback(v); } );");
        expect(v).to.exist;
    });


    it("Find notification button", async function () {
        expect(client).to.exist;
        notificationButton = await client.findElement(webdriver.By.id("desktop-notification"));
    });

    it("Click notification button", async function () {
        expect(client).to.exist;
        expect(notificationButton).to.exist;
        await notificationButton.click();
        // give time for notification to show up
        await client.sleep(2000);
    });


    it("Find CPU Info button", async function () {
        expect(client).to.exist;
        cpuInfoButton = client.findElement(webdriver.By.id("cpu-info"));
        expect(cpuInfoButton).to.exist;
    });

    it("Click CPU Info button", async function () {
        expect(client).to.exist;
        expect(cpuInfoButton).to.exist;
        await cpuInfoButton.click();
        // sleep here so CPU Info window stay shown for us to see
        await client.sleep(2000);
    });

    it('Switch to CPU Info window', async function () {
        expect(client).to.exist;
        await switchWindowByTitle("Hello OpenFin CPU Info");
    });

    it('Get window position', async function () {
        const data = executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.Window.getCurrent().getBounds(function(data) { callback(data); } );");
        expect(data).to.exist;
    });

    it('Get window state', async function () {
        const data = executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.Window.getCurrent().getState(function(data) { callback(data); } );");
        expect(data).to.exist;
    });

    it("Find Exit button for CPU Info window", async function () {
        expect(client).to.exist;
        cpuInfoExitButton = client.findElement(webdriver.By.id("close-app"));
    });

    it("Click CPU Info Exit button", async function () {
        expect(client).to.exist;
        expect(cpuInfoExitButton).to.exist;
        await cpuInfoExitButton.click();
    });

    it('Exit OpenFin Runtime', async function () {
        expect(client).to.exist;
        await executeJavascript("fin.desktop.System.exit();");
    });


});
