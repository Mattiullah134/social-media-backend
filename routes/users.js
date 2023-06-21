const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


// update the user 
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.userid == id || req.body.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }
            const user = await User.findByIdAndUpdate(id, { $set: req.body });
            res.status(200).json({ success: true, message: "Account update successfully" })
        } else {
            (403).json({ success: false, message: "You can only update your account", error })
        }
    } catch (error) {
        res.status(403).json({ success: false, message: "Something went wrong", error })

    }
})
// delete the user 
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.userid == id || req.body.isAdmin) {
            const deleteData = await User.deleteOne({ _id: id });
            res.status(200).json({ success: true, message: "Account delete successfully", deleteData })
        } else {
            (403).json({ success: false, message: "You can only delete your account", error })
        }
    } catch (error) {
        res.status(403).json({ success: false, message: "Something went wrong", error })

    }
})
// get a user 
router.get("/:id", async (req, res) => {
    try {

        const userData = await User.findOne({ _id: req.params.id });
        const { password, updatedAt, ...other } = userData._doc;
        res.status(200).json({ success: true, message: "Get the data", other })

    } catch (error) {
        res.status(401).json({ success: false, message: "You can only access your account" })

    }
})
// follow the user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userid !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);
            if (!user.followers.includes(req.body.userid)) {
                await user.updateOne({ $push: { followers: req.body.userid } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json({ message: "user have been followed" })
            } else {
                res.status(403).json({ message: "You already follow this account" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(401).json({ success: false, message: "you cannot follow yourself" })
    }
})
// unfollow the user -> todo
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userid !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);
            if (user.followers.includes(req.body.userid)) {
                await user.updateOne({ $pull: { followers: req.body.userid } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json({ message: "user have been unfollowed" })
            } else {
                res.status(403).json({ message: "You already unfollow this account" })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(401).json({ success: false, message: "you cannot unfollow yourself" })
    }
})
module.exports = router