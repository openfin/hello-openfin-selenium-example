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

    before(function(done) {

        // configure webdriver
        var driverOptions = {
            desiredCapabilities: config.desiredCapabilities,
            host: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.testTimeout,
            logLevel: 'verbose'  // http://webdriver.io/guide/getstarted/configuration.html
        };
        client = webdriver.remote(driverOptions);

        if (!config.remoteDriverPath) {
            client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
        }
        client.init().then(function () {
            client.timeouts("implicit", config.testTimeout).then(function (t) {
                client.timeouts("script", config.testTimeout).then(function (t2) {
                    client.timeouts("page load", config.testTimeout).then(function (t3) {
                        done();
                    })
                });

            });
        });
    });

    after(function() {
        return client.end();
    });


    /**
     * Select a Window
     * @param windowHandle handle of the window
     * @param callback callback with window title if selection is successful
     */
    function switchWindow(windowHandle, callback) {
        client.switchTab(windowHandle).then(function () {
            client.getTitle().then(function (title) {
                callback(title);
            });
        });
    }

    /**
     * Select the window with specified title
     * @param windowTitle window title
     * @param done done callback for Mocha
     */
    function switchWindowByTitle(windowTitle, done) {
        client.getTabIds().then(function (tabIds) {
            var handleIndex = 0;
            var checkTitle = function (title) {
                if (title === windowTitle) {
                    done();
                } else {
                    handleIndex++;
                    if (handleIndex < tabIds.length) {
                        switchWindow(tabIds[handleIndex], checkTitle);
                    } else {
                        // the window may not be loaded yet, so call itself again
                        switchWindowByTitle(windowTitle, done);
                    }
                }
            };
            switchWindow(tabIds[handleIndex], checkTitle);
        });
    }


    /**
     *  Check if OpenFin Javascript API fin.desktop.System.getVersion exits
     *
    **/
    function checkFinGetVersion(callback) {
        client.executeAsync(function (done) {
            if (fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion) {
                done(true);
            } else {
                done(false);
            }
        }).then(function (result) {
            callback(result.value);
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
                client.pause(1000).then(function() {
                    waitForFinDesktop(readyCallback);
                });                
            }
        };
        checkFinGetVersion(callback);
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
        client.executeAsync(function (done) {
            fin.desktop.System.getVersion(function(v) { console.log(v); done(v); } );
        }).then(function (result) {
            should.exist(result.value);
            result.value.should.equal(config.expectedRuntimeVersion);
            done();
        });
    });

    it("Find notification button", function(done) {
        should.exist(client);
        client.element("#desktop-notification").then(function(result) {
            should.exist(result.value);
            notificationButton = result.value;
            done();
        });
    });

    it("Click notification button", function(done) {
        should.exist(client);
        should.exist(notificationButton);
        client.elementIdClick(notificationButton.ELEMENT).then(function(result) {
            done();
        });
    });


    it("Find CPU Info button", function(done) {
        should.exist(client);
        client.element("#cpu-info").then(function(result) {
            should.exist(result.value);
            cpuInfoButton = result.value;
            done();
        });
    });

    it("Click CPU Info button", function(done) {
        should.exist(client);
        should.exist(cpuInfoButton);
        client.elementIdClick(cpuInfoButton.ELEMENT).then(function(result) {
            client.pause(3000).then(function() {  // pause just for demo purpose so we can see the window
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
        client.element("#close-app").then(function(result) {
            should.exist(result.value);
            cpuInfoExitButton = result.value;
            done();
        });
    });

    it("Click CPU Info Exit button", function(done) {
        should.exist(client);
        should.exist(cpuInfoExitButton);
        client.elementIdClick(cpuInfoExitButton.ELEMENT).then(function(result) {
            done();
        })
    });

    it('Exit OpenFin Runtime', function (done) {
        should.exist(client);
        client.execute(function () {
            fin.desktop.System.exit();
        });
        client.pause(1000).then(function() {  // pause here to give Runtime time to exit
            done();
        });
    });

});
