/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and Wd (http://admc.io/wd/)
 *
 */

"use strict";

var url = require('url');
var chaiAsPromised = require("chai-as-promised");
var chai = require('chai');
chai.use(chaiAsPromised);
var should = chai.should();

var wd = require('wd');
// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var config = require("../../config");


describe('Hello OpenFin App testing with WD', function() {
    var client;

    this.timeout(config.testTimeout);

    before(function() {
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

    function switchWindow(windowHandle, callback) {
        client.window(windowHandle, function(err) {
            should.not.exist(err);
            client.title(function (err, result) {
                should.not.exist(err);
                callback(result);
            });
        });
    }

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
                        throw new Error("Window not found " + title);
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
        "fin.desktop.System.getVersion(function(v) { callback(v); } );", function(err, version) {
            should.not.exist(err);
            should.exist(version);
            version.should.equal(config.expectedRuntimeVersion);
            done();
        });
    });

    it("Click notification button", function() {
        should.exist(client);
        client.elementByCss("#desktop-notification").click();
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
