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
            should.not.exist(err);
            client.title(function (err, result) {
                should.not.exist(err);
                if (err) {
                    callback(undefined);                    
                } else {
                    callback(result);                    
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

    it('Verify OpenFin Runtime Version', function(done) {
        should.exist(client);
        executeAsyncJavascript("var callback = arguments[arguments.length - 1];" +
        "fin.desktop.System.getVersion(function(v) { callback(v); } );", function(err, version) {
            should.not.exist(err);
            should.exist(version);
            version.should.equal(config.expectedRuntimeVersion);
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
