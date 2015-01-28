/**
 *
 * Example test script for Super Calculator (http://juliemr.github.io/protractor-demo/index.html) using Protractor 
 *
 * config.js: https://github.com/angular/protractor/blob/master/docs/referenceConf.js
 */

"use strict";

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
                extensions: [],
                debuggerAddress: 'localhost:9090',
                binary: "../../OpenFinRVM.exe",
                args: ['--config=http://test.openf.in/bus/protractor.json']
		}
	}, 
  specs: ['hello-openfin.js'],
  allScriptsTimeout: 10000,
  getPageTimeout: 10000,
  chromeDriver: '../../chromedriver',
  directConnect: true
}