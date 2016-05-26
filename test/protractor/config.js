/**
 *
 * Example test script for Super Calculator (http://juliemr.github.io/protractor-demo/index.html) using Protractor 
 *
 * config.js: https://github.com/angular/protractor/blob/master/docs/referenceConf.js
 */

"use strict";

var spawn = require('child_process').spawn;

var openfinBinary = "..\\..\\openfin-installer.exe",
    openfinArgs = ['--config=http://test.openf.in/bus/protractor.json'];

exports.config = {
	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
                extensions: [],
                debuggerAddress: 'localhost:9090'
		}
	}, 
  specs: ['hello-openfin.js'],
  allScriptsTimeout: 20000,
  getPageTimeout: 20000,
  seleniumAddress: 'http://localhost:9515',
  directConnect: false,
  beforeLaunch: function() {
    if (process.platform === 'win32') {
        var args = ['/c', openfinBinary].concat(openfinArgs);
        console.log(args);    
        spawn('cmd.exe', args);
    } else {
        spawn(openfinBinary, openfinArgs);
    }
  }
}