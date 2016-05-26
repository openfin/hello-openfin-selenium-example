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
                debuggerAddress: 'localhost:9090',
                //binary: "openfin-installer.exe",
                binary: '%LocalAppData%\\OpenFin\\RunOpenFinRVM.bat',
                args: ['--config=https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/app.json']
            }
        },
        remoteDriverHost: "localhost",
        remoteDriverPort: 9515,
        testTimeout: 20000,
        expectedRuntimeVersion: "6.49.11.73"
    };

    config.remoteDriverUrl = "http://" + config.remoteDriverHost + ":" + config.remoteDriverPort;
    return config;

})();

