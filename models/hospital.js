const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema

var hospitalSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    description: {type: String},
    location: {
        latitude: Number,
        longitude: Number
    }
}, {
    timestamps: true,
    autoIndex: 1
})

hospitalSchema.static.findByEmail = function (email, cb) {
    return this.find({email: email}, cb)
}

hospitalSchema.pre("save", function (next) {
    var hospital = this
    var saltRounds = 10
    
       
    if (!hospital.isModified("password")) {
        return next();
    }
    
    bcrypt.hash(hospital.password, saltRounds, (error, hash) => {
        if (error) {
            return next(error)
        }
        else {
            hospital.password = hash
            next()
        }
    })
})

hospitalSchema.methods.comparePasssword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
        cb(error, isMatch)
    })
}

module.exports = mongoose.model("hospital", hospitalSchema)