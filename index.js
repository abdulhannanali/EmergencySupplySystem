/*
 * index.js
 * Express an instance of the express application for the server to run
 * Along with the custom configurations
 * Authors: Hannan Ali
 *
 */ 
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const bodyParser = require("body-parser")
const colors = require("colors")

const flash = require("express-flash")
const session = require("express-session")

mongoose.connect(process.env.MONGODB_CONNECTION_URI || "mongodb://localhost:27017/essdb", (error) => {
    if (!error) {
        console.log("MongoDB connection established" .green)
    }
    else {
        console.error(error + "" .red)
    }
})

const app = express()

// setting the view engine
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")


// static files this app is going to serve
app.use("/static", express.static(path.join(__dirname, "/static/")))
app.use("/bower", express.static(path.join(__dirname, "/bower_components/")))


// Integration of the server extensions with the app
app.use(require("./serverExtensions/logConfigs"))


app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    resave: true,
    secret: "yo!"
}))
app.use(flash())

// Routes the app is using
app.use("/", require("./routes/index.js"))
app.use("/admin/", require("./routes/account/signup.js"))



module.exports = app
