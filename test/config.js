/**
 * Example config for running test script
 */

"use strict";

module.exports = {
    driverOptions: {   // used by webdriver.io
        desiredCapabilities: {
            browserName: 'chrome'
        },
        host: 'localhost',
        port: 8818,
        logLevel: 'info'
    },
    driverServerUrl: "http://localhost:8818/wd/hub",   // used by selenium-webdriver
    username: "wenjun@openfin.co",
    password: "wenjun123",
    messageToJid: "mark$openfin.co@openchat.co",
    chatAppUrl: 'http://chat.openf.in/newopenchat/index.html?adapter=http:%2F%2Fchat.openf.in%2Fnewstrophe%2Findex.html',
    testTimeout: 10000

};
