/**
 * Example test script for Hello OpenFin app using Mocha, CHAI and selenium-webdriver (https://www.npmjs.org/package/selenium-webdriver)
 */

"use strict";

var expect = require('chai').expect,
    until = require('selenium-webdriver').until,
    webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    config = require("../../config");


describe('Hello OpenFin App testing with selenium-webdriver', function() {
    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function() {
        var capabilities = webdriver.Capabilities.chrome();
        capabilities.set('chromeOptions', config.desiredCapabilities.chromeOptions);
        client = new webdriver.Builder().usingServer(config.remoteDriverUrl).withCapabilities(capabilities).build();
    });

    after(function(done) {
        // needs "done" here to give time to run .end()
        client.quit().then(function() {
            done();
        });
    });

    function switchWindow(windowHandle, callback) {
        client.switchTo().window(windowHandle).then(function() {
            client.getTitle().then(function (title) {
                callback(title);
            });
        });
    }

    function switchWindowByTitle(windowTitle, done) {
        client.getAllWindowHandles().then(function(handles) {
            var handleIndex = 0;
            var checkTitle = function (title) {
                if (title === windowTitle) {
                    done();
                } else {
                    handleIndex++;
                    if (handleIndex < handles.length) {
                        switchWindow(handles[handleIndex], checkTitle);
                    } else {
                        throw new Error("Window not found " + title);
                    }
                }
            };
            switchWindow(handles[handleIndex], checkTitle);
        });
    }

    function executeAsyncJavascript(script) {
        return client.executeAsyncScript(script);
    }


    it('Switch to Hello OpenFin Main window', function(done) {
        expect(client).to.exist;
        switchWindowByTitle("Hello OpenFin", done);
    });

    it('Get OpenFin Runtime Version', function(done) {
        expect(client).to.exist;
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
            "fin.desktop.System.getVersion(function(v) { callback(v); } );").then(function(v) {
            expect(v).to.equal(config.expectedRuntimeVersion);
                done();
            });
    });


    it("Find notification button", function(done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("desktop-notification")).then(function(result) {
            notificationButton = result[0];
            done();
        });
    });

    it("Click notification button", function(done) {
        expect(client).to.exist;
        expect(notificationButton).to.exist;
        notificationButton.click().then(function() {
            done();
        });
    });


    it("Find CPU Info button", function(done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("cpu-info")).then(function(result) {
            cpuInfoButton = result[0];
            done();
        });
    });

    it("Click CPU Info button", function(done) {
        expect(client).to.exist;
        expect(cpuInfoButton).to.exist;
        cpuInfoButton.click().then(function() {
            client.sleep(3000).then(function() {
                done();
            });
        });
    });

    it('Switch to CPU Info window', function(done) {
        expect(client).to.exist;
        switchWindowByTitle("Hello OpenFin CPU Info", done);
    });


    it("Find Exit button for CPU Info window", function(done) {
        expect(client).to.exist;
        client.findElements(webdriver.By.id("close-app")).then(function(result) {
            cpuInfoExitButton = result[0];
            done();
        });
    });

    it("Click CPU Info Exit button", function(done) {
        expect(client).to.exist;
        expect(cpuInfoExitButton).to.exist;
        cpuInfoExitButton.click().then(function() {
            client.sleep(3000).then(function() {
                done();
            });
        });
    });


});
