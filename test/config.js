/**
 * Example config for running test script
 */

"use strict";

module.exports = (function () {
    var isWinOS = (process.platform == 'win32');
    var launch_target = isWinOS ? 'RunOpenFin.bat' : './RunOpenFin.sh';
    var config = {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                extensions: [],
                binary: launch_target,
                args: ['--config=http://localhost:8000/app.json']
            }
        },
        remoteDriverHost: "localhost",
        remoteDriverPort: 9515,
        //remoteDriverPath: "/wd/hub",
        testTimeout: 20000,
        expectedRuntimeVersion: "9.61.33.22"
    };

    config.remoteDriverUrl = "http://" + config.remoteDriverHost + ":" + config.remoteDriverPort + 
        (config.remoteDriverPath || "");
    return config;

})();

