/**
 * Example config for running test script
 */

"use strict";

module.exports = (function() {
    var config = {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                args: [],
                extensions: [],
                debuggerAddress: 'localhost:9090'
            }
        },
        remoteDriverHost: "10.211.55.5",
        remoteDriverPort: 9515,
        testTimeout: 10000,
        expectedRuntimeVersion: "3.0.1.5"
    };

    config.remoteDriverUrl = "http://" + config.remoteDriverHost + ":" + config.remoteDriverPort;
    return config;

})();

