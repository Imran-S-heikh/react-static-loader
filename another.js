const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
    module.exports = function anotherThread(data) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: data
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    };
} else {
    const ReactDOMServer = require('react-dom/server');
    const fs = require('fs');
    const React = require('react');
    const { curFile } = workerData;

    if (fs.existsSync(curFile)) {
        const Component = require(curFile);
        const html = ReactDOMServer.renderToStaticMarkup(React.createElement(Component['default'], null));
        parentPort.postMessage(html)
    }
}