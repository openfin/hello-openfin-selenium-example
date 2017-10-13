/**
 * Example of running Mocha programmatically
 */
const Mocha = require('mocha');

function runMochaTests() {
    return new Promise((resolve, reject) => {
            // according to https://github.com/mochajs/mocha/issues/995
            // "delete require.cache" is needed for running the same test multiple times
            Object.keys( require.cache ).forEach( function( file ) {
                delete require.cache[file];
            });
            const mocha = new Mocha();
            mocha.addFile( 'test/WebDriverJs/Mocha/hello-openfin.js' );
            mocha.run(resolve);
        } );


}

// running the test multiple times
let count = 20;
let pr = runMochaTests();
while (count > 0) {
    pr = pr.then(runMochaTests);
    count -= 1;
}
