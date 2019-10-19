const _         = require("../../../../gulp/plugin");
const errMsg = require("./parameters/errMsg");

module.exports = {
    write: (filepath, contents, msg) => {
        _.fs.writeFileSync(filepath, contents, (err) => {
            //書き込みに失敗
            if(err){
                msg.push(`errMsg12: ${filepath}への${errMsg["12"]} (${err})`);
            }
        })
        return msg;
    }
};