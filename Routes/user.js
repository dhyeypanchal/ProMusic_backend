const express = require('express');
const User = require("../models/userModel")
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchUser = require("../Middleware/fetchUser")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


// for sign up the user
// ROUTE:1 create a user using: POST "/signup" , no login required
router.post("/signup",
// username must be an email
body('email', 'Enter a valid email').isEmail(),
// password must be at least 5 chars long
body('password', 'password must be atleast 5 charactors').isLength({ min: 5 }), async (req, res) => {
    let success = false;
    // if there is error in validation so we directly send this without storing data in database.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // check whether user with this email already exist already.
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "sorry user with this email already exist." })
        }
        
        // hashing the password
        const salt = await bcryptjs.genSalt(10);
        const secPass = await bcryptjs.hash(req.body.password, salt)
        
        // create a new user
        user = await User.create({
            name:req.body.name,
            email: req.body.email,
            password: secPass
        })
        
            const data = {
                user: {
                    id: user.id
                }
            }
    
            const token = jwt.sign(data, JWT_SECRET)
            success = true;
            res.json({ success, token })
        }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

// for login the user
// ROUTE:2 authenticate a user using: POST "/login" , no login required 
router.post("/login",
body('email', 'Enter a valid email').isEmail(),
body('password', 'password not be blank').exists(), async (req, res) => {
    let success = false;
    // if there is error in validation so we directly send this without storing data in database.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }) // this is similar as email:email in ES6.
        if (!user) {
            success = false
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }
        const passwordcompare = await bcryptjs.compare(password, user.password); //first argument is what user type in authentication time and second one is password that store in db.
        if (!passwordcompare) {
            success = false
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const token = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({ success, token })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

// ROUTE:3 get logged in user details using: POST "/getuser", login required
router.get("/getuser", fetchUser, async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

module.exports = router;