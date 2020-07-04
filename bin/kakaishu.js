const fs           = require('fs');
const functions    = require('../gulp/functions');
const sampleEnvFile = './sample.env';
const envFile = './.env';

if(functions.isExistFile(sampleEnvFile) && !functions.isExistFile(envFile)) {
    fs.writeFileSync(envFile, fs.readFileSync(sampleEnvFile, 'utf8'), (err) => {
        if(err) {
            console.log(err);
        }
    });
}
