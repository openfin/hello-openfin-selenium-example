/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and WebdriverIO (http://webdriver.io)
 *
 * wedriver.io assumes server URL is /wd/hub.  So if testing with chromedriver directly, it needs to run as
 *     chromedriver --url-base=/wd/hub
 *
 */

"use strict";

var should = require('chai').should(),
    webdriver = require('webdriverio'),
    assert = require("assert"),
    config = require("../../config");


describe('Hello OpenFin App testing with webdriver.io', function() {
    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function() {
        var driverOptions = {
            desiredCapabilities: config.desiredCapabilities,
            host: config.remoteDriverHost,
            port: config.remoteDriverPort,
            waitforTimeout: config.remoteDriverPort,
            logLevel: 'debug'
        };
        client = webdriver.remote(driverOptions).init();
        client.timeoutsImplicitWait(config.remoteDriverPort);
        client.timeoutsAsyncScript(config.remoteDriverPort);
        client.timeouts("page load", config.remoteDriverPort);
        client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
    });

    after(function(done) {
        // needs "done" here to give time to run .end()
        client.end(function() {
            done();
        });
    });


    function switchWindow(windowHandle, callback) {
        client.switchTab(windowHandle, function(err) {
            should.not.exist(err);
            client.title(function (err, result) {
                should.not.exist(err);
                callback(result.value);
            });
        });
    }

    function switchWindowByTitle(windowTitle, done) {
        console.log("switchWindowByTitle: ", windowTitle);
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
                        switchWindowByTitle(windowTitle, done);
                    }
                }
            };
            switchWindow(handles[handleIndex], checkTitle);
        });
    }

    function executeAsyncJavascript(script, resultCallback) {
        client.executeAsync(script, resultCallback);
    }

    function executeJavascript(script, resultCallback) {
        client.execute(script, resultCallback);
    }

    it('Switch to Hello OpenFin Main window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin", done);
    });


    it('Verify OpenFin Runtime Version', function(done) {
        should.exist(client);
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "fin.desktop.System.getVersion(function(v) { callback(v); } );", function(err, result) {
            should.not.exist(err);
            should.exist(result.value);
            result.value.should.equal(config.expectedRuntimeVersion);
            done();
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
