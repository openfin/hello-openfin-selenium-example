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
    let client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(async ()=> {
        if (config.desiredCapabilities.chromeOptions.debuggerAddress) {
            // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
            // it needs to start separately
            spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
        }

        // configure webdriver
        const driverOptions = {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    extensions: [],
                    debuggerAddress: 'localhost:9090'    
                }
            },
            hostname: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.testTimeout,
            connectionRetryTimeout: 900000,
            connectionRetryCount: 1,        
            logLevel: 'trace'
        };
        console.log(driverOptions);
        client = await webdriver.remote(driverOptions);
        await client.setTimeout({
            'implicit': config.testTimeout,
            'pageLoad': config.testTimeout,
            'script': config.testTimeout
        });        
    });

    after(async () => {
        await client.deleteSession();
    });


    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    async function switchWindow(windowHandle, callback) {
        await client.switchToWindow(windowHandle);
        const title = await client.getTitle();
        callback(title);
    }

    /**
     * Select the window with specified title
     * @param windowTitle window title
     */
    async function switchWindowByTitle(windowTitle) {
        const handles = await client.getWindowHandles();
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
     *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
     *
    **/
    async function checkFinGetVersion(callback) {
        const result = await client.executeAsync(function (done) {
            if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
                done(true);
            } else {
                done(false);
            }
        });
        callback(result);
    }

    /**
     *  Wait for OpenFin Javascript API to be injected 
     *
    **/
     async function waitForFinDesktop() {
        var callback = async (ready) => {
            if (ready === true) {
                return;
            } else {
                await client.pause(1000);
                await waitForFinDesktop();
            }
        };
        await checkFinGetVersion(callback);
    }

    it('Switch to Hello OpenFin Main window', async () => {
        should.exist(client);
        await switchWindowByTitle("Hello OpenFin");
    });

    it('Wait for OpenFin API ready', async () => {
        should.exist(client);
        await waitForFinDesktop();
    });

    it('Verify OpenFin Runtime Version', async () => {
        should.exist(client);
        const result = await client.executeAsync(function (donedone) {
            fin.desktop.System.getVersion(function(v) { console.log(v); donedone(v); } );
        });
        should.exist(result);
    });

    it("Find notification button", async () => {
        should.exist(client);
        const button = await client.$("#desktop-notification");
        should.exist(button);
        notificationButton = button;
    });

    it("Click notification button", async () => {
        should.exist(client);
        should.exist(notificationButton);
        await notificationButton.click();
    });


    it("Find CPU Info button", async () => {
        should.exist(client);
        const button = await client.$("#cpu-info");
        should.exist(button);
        cpuInfoButton = button;
    });

    it("Click CPU Info button", async () => {
        should.exist(client);
        should.exist(cpuInfoButton);
        await cpuInfoButton.click();
        await client.pause(3000);  // pause just for demo purpose so we can see the window
    });


    it('Switch to CPU Info window', async () => {
        should.exist(client);
        await switchWindowByTitle("Hello OpenFin CPU Info");
    });


    it("Find Exit button for CPU Info window", async () => {
        should.exist(client);
        const button = client.$("#close-app");
        should.exist(button);
        cpuInfoExitButton = button;
    });

    it("Click CPU Info Exit button", async () => {
        should.exist(client);
        should.exist(cpuInfoExitButton);
        await cpuInfoExitButton.click();
    });

    it('Exit OpenFin Runtime', async () => {
        should.exist(client);
        await client.execute(function () {
            fin.desktop.System.exit();
        });
        await client.pause(1000);  // pause here to give Runtime time to exit
    });

});
