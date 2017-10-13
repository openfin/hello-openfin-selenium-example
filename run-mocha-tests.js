/**
 * Example of running Mocha programmatically
 */
const Mocha = require('mocha');

function runMochaTests() {
    return new Promise((resolve, reject) => {
            // https://github.com/mochajs/mocha/issues/995
            Object.keys( require.cache ).forEach( function( file ) {
                delete require.cache[file];
            });
            const mocha = new Mocha();
            mocha.addFile( 'test/WebDriverJs/Mocha/hello-openfin.js' );
            mocha.run(resolve);
        } );


}

// running the test multiple times
runMochaTests()
    .then(runMochaTests)
    .then(runMochaTests)
;