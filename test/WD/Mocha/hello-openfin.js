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

var config = require("../../tests_config");


describe('Hello OpenFin App testing', function() {
    var client, notificationButton, cpuInfoButton, cpuInfoExitButton;

    this.timeout(config.testTimeout);

    before(function() {
        client = wd.promiseChainRemote(url.parse("http://10.211.55.4:9515"));

        //        client = wd.remote(url.parse(config.driverServerUrl));
        return client.init({
            browserName: 'chrome',
            'chromeOptions': {
                      args: [],
                      extensions: [],
                        debuggerAddress: 'localhost:9090'
                    }
        });
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

    it('Switch to Hello OpenFin Main window', function(done) {
        should.exist(client);
        switchWindowByTitle("Hello OpenFin", done);
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


});
