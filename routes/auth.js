const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
// register the user
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        })
        const savedData = await user.save();
        res.status(200).json({ success: true, message: "new user add successfully", savedData })
    } catch (error) {
        res.status(401).json({ success: false, message: "Something went wrong", error })

    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ success: false, message: "user not found" })
        } else {
            const isCorrectPass = await bcrypt.compare(password, user.password);
            if (isCorrectPass) {
                res.status(200).json({ success: true, message: "login successfully", username: user.username, email: user.email })
            } else {

                res.status(400).json({ success: false, message: "incorrect password" })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error })

    }
})

module.exports = router