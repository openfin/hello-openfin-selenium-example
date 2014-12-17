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

    require('load-grunt-tasks')(grunt); // load all grunt modules

    grunt.initConfig({
        watch: {
            files: tests,
            options: {
                spawn: false,
                event: ['added', 'changed']
            }
        },
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
