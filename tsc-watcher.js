const watch = require('tsc-watch/client');
// const tscWatch = require('./node_modules/tsc-watch/lib/tsc-watch.js');
const {
    promisify
} = require('util');
const { fork, exec } = require('child_process');
const runCmd = promisify(exec);

(async function() {
    async function executeBrowserify() {
        const result = await runCmd('browserify dist/index.js --standalone akkd > dist_bundle/bundle.js && node dist_bundle/bundle.js');

        if (result.stdout != '')
            console.log(result.stdout);
        else if (result.stdout != '')
            console.log('error:', result.stderr);
    }

    ['first_success', 'subsequent_success'].forEach(function(eventType, index, array) {
        watch.on(eventType, async function() {
            await executeBrowserify();
        });
    });

    watch.on('compile_errors', function() {
        // console.log('error:', arguments);
    });

    watch.start = function(...args) {
        this.tsc = fork(
            require.resolve('./node_modules/tsc-watch/lib/tsc-watch.js'),
            args,
            {
                stdio: 'inherit',
                execArgv: []
            }
        );

        this.tsc.on('message', msg => {
            this.emit(msg)
        });
    }

    watch.start();

    try {
        // do something...
    } catch (e) {
        watch.kill(); // Fatal error, kill the compiler instance.
    }
})();
