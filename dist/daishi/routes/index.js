const _         = require("../../../gulp/plugin")
const dir       = require("../../../gulp/dir")
const functions = require("../../../gulp/functions")
const express   = require("express")
const router    = express.Router()
const labelList = require("../app/parameters/labelList")

/* GET home page. */
router.get("/", (req, res, next) => {
    const config = functions.getConfig(dir.config.config)
    const commonVar = functions.getConfig(dir.config.commonvar)
    let gulpConfig = functions.getConfig(dir.config.gulpconfig)
    const hachizetsu = functions.getConfig(dir.config.hachizetsu, "")
    //前処理
    gulpConfig.ftp.user = functions.decrypt(String(hachizetsu.key), gulpConfig.ftp.user, functions)
    gulpConfig.ftp.password = functions.decrypt(String(hachizetsu.key), gulpConfig.ftp.password, functions)
    res.render("index", {
        config: config,
        commonVar: commonVar,
        gulpConfig: gulpConfig,
        filename: "index",
        pagecat: "init",
        labelList: labelList
    })
    res.end()
})

module.exports = router
