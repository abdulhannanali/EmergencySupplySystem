const express = require("express")
const _ = require("lodash")
const expressValidator = require("express-validator")
const Hospital = require("../../models/hospital")
const router = express.Router()

var hospitalTypes = [
        "General",
        "District",
        "Specialized",
        "Teaching",
        "Clinics"
]

router.use(expressValidator({
    customValidators: {
        isType: (type) => {
            return hospitalTypes.some((value) => value === type)
        }
    }
}))

router.get("/signup", (req, res, next) => {
    res.render("signup", {
        descriptionLimit: 5000,
        hospitalTypes: hospitalTypes
    })
})


router.post("/signup", (req, res, next) => {
    validate(req)
    
    var errors = req.validationErrors()
    req.flash("errors", errors)
    
    if (_.isEmpty(errors)) {
        var hospital = new Hospital({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            description: req.body.description
        })
        
        hospital.save((error) => {
            if (error) {
                next(error)
            }
            else {
                next()
            }
        })    
    }
    else {
        res.redirect("/admin/signup")
    }
})

router.use((error, req, res, next) => {
    var errorObj = {}
    
    if (error && error.name == "ValidationError") {
       errorObj.msg = "Hospital's form is not properly filled. Please check again!!!"
       req.flash("errors", errorObj)
       return res.redirect("/admin/signup")
    }
    else {
        next(error)
    }
    
})


// validate validates the signup input 
function validate(req) {
    var signupSchema = signupValidationsSchema(req)
    req.check(signupSchema)
}

function signupValidationsSchema (req) {
    var schema = {
        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: "Invalid Email"
            },
            errorMessage: "Please enter an email"
        },
        'password': {
            notEmpty: true,
            isLength: {
                options: [{min: 8, max: 20}],
                errorMessage: "Length of the password should be between 8 and 20"
            }
        },
        'repassword': {
            equals: {
                options: [req.body.password],
                errorMessage: "The passwords do not match"
            }
        },
        'type': {
            notEmpty: true
        },
        'description': {
            notEmpty: true,
            isLength: {
                options: [
                    {min: 2000, max: 5000}
                ],
                errorMessage: "The description should be between 2000 and 5000 characters long"
            }
        }
    }
    
    return schema    
}


module.exports = router