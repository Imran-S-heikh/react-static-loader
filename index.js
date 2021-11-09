const path = require('path');
const fs = require('fs');
const anotherThread = require('./another');
const rs = path.resolve;


module.exports = function (source) {
    const callback = this.async();
    const sourcePath = this.resourcePath;
    const subPath = sourcePath.split('src').reverse()[0];
    const fileName = subPath.split('/').reverse()[0]
    const subDir = subPath.replace(fileName, '');
    const ext = fileName.split('.').reverse()[0];
    const name = fileName.replace(`.${ext}`, '');
    const loaderPath = rs(__dirname);
    const tempDir = rs(loaderPath, './temp');
    const curFile = rs(tempDir, `./${subDir}/${name}.js`);
    const subDirFull = rs(tempDir, `./${subDir}`);

    if (!fs.existsSync(subDirFull)) {
        fs.mkdirSync(subDirFull, { recursive: true });
    }

    fs.writeFileSync(curFile, source);

    anotherThread({curFile}).then((html)=>{
        if (subPath.includes('pages')) {
            this.emitFile(`${name}.html`, html);
        }
        callback(null, '');
    });

}