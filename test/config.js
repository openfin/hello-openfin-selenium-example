/**
 * Example config for running test script
 */

"use strict";

module.exports = (function () {
    var isWinOS = (process.platform == 'win32');
    var launch_target = isWinOS ? 'RunOpenFin.bat' : './RunOpenFin.sh';
    var launch_config = isWinOS ? 'http://localhost:8000/app.json' : './test/app.json';
    var config = {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                extensions: [],
                binary: launch_target,
                args: ['--config=' + launch_config],
                // if devtools_port is set in app.json and ChromeDriver needs to communicate on that port,  set the following propery
                // to be the same as devtools_port
                //debuggerAddress: 'localhost:9090'
            }
        },
        remoteDriverHost: "localhost",
        remoteDriverPort: 9515,
        //remoteDriverPath: "/wd/hub",
        testTimeout: 20000,
        expectedRuntimeVersion: "10.66.41.18"
    };

    config.remoteDriverUrl = "http://" + config.remoteDriverHost + ":" + config.remoteDriverPort + 
        (config.remoteDriverPath || "");
    return config;

})();

