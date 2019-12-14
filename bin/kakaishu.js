const fs           = require('fs');
const functions    = require('../gulp/functions');
const sampleEnvFile = './sample.env';

if(functions.isExistFile(sampleEnvFile)) {
    fs.writeFileSync('./.env', fs.readFileSync(sampleEnvFile, 'utf8'), (err) => {
        if(err) {
            console.log(err);
        }
    });
}
