/**
 * Example config for running test script
 */

"use strict";

module.exports = (function () {
    var config = {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                extensions: [],
                binary: 'RunOpenFin.bat',
                args: ['--config=https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/app2.json']
            }
        },
        remoteDriverHost: "localhost",
        remoteDriverPort: 8818,
        //remoteDriverPath: "/wd/hub",
        testTimeout: 20000,
        expectedRuntimeVersion: "6.49.16.15"
    };

    config.remoteDriverUrl = "http://" + config.remoteDriverHost + ":" + config.remoteDriverPort + 
        (config.remoteDriverPath || "");
    return config;

})();

