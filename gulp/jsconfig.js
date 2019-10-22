//path difinition
module.exports = {
    configHtmlMin: {
        removeComments : true
    },
    htmlInitDel: /[\s\S]*?(<!DOCTYPE)/i,
    htmlSpaceLineDel: /[ ]+(\r\n|\n|\r)+/gi
};