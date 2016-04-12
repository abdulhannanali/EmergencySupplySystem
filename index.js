/*
 * index.js
 * Express an instance of the express application for the server to run
 * Along with the custom configurations
 * Authors: Hannan Ali
 *
 */ 
const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(require("./serverExtensions/logConfigs"))

module.exports = app
