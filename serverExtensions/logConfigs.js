const express = require("express")
const morgan = require("morgan")

const router = express.Router()

const env = process.env.NODE_ENV || "development"

var MORGAN_MODE = ""

if (env == "development") {
    MORGAN_MODE = "dev"
}
else {
    MORGAN_MODE = "combined"
}

router.use(morgan(MORGAN_MODE))

module.exports = router