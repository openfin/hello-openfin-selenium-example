/*
 * Before running, make sure to do:
 * - npm install
 * - npm install -g grunt-cli
 *
 * TASKS:
 * grunt - runs Mocha tests (default task)
 */

'use strict';

module.exports = function(grunt) {
    var tests = ['test/**/*.js'];
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: tests
            }
        }
    });
    grunt.registerTask('default', 'mochaTest');
};
