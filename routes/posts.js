const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();



// create the post
router.post('/create', async (req, res) => {
    try {
        const newPost = await Post(req.body).save();
        res.status(200).json({ success: true, message: "New Post added successfully", newPost })
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })

    }
})
// update the post
router.put('/update/:id', async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        if (post.userid === req.body.userid) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({ success: true, message: "Update successfully" })
        } else {

            res.status(403).json({ success: false, message: "You only update your post" })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })

    }
})
// delete the post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        if (post.userid === req.body.userid) {
            await post.deleteOne();
            res.status(200).json({ success: true, message: "Delete Post successfully" })
        } else {

            res.status(403).json({ success: false, message: "You only delete your post" })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })

    }
})
// like the post 
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userid)) {
            await post.updateOne({ $push: { likes: req.body.userid } });
            res.status(200).json({ success: true, message: "You like the post" });
        } else {
            await post.updateOne({ $pull: { likes: req.body.userid } });
            res.status(200).json({ success: true, message: "You dislike the post" });
        }
    } catch (error) {
        res.status(200).json({ success: true, message: "You like the post" });
    }
})
// dislike the post
// get all the post post

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log('this is the id ', req.params.id);

        res.status(200).json({ success: true, message: "Fetch your post", post })

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })

    }
})

router.get("/timeline/all", async (req, res) => {
    try {
        const userDetail = await User.findById(req.body.userid);
        const userPost = await Post.find({ userid: userDetail._id });
        const friendPosts = await Promise.all(
            userDetail.followings?.map(friendId => {
                return Post.find({ userid: friendId });
            })
        )
        console.log(friendPosts);
        res.status(200).json({ success: true, message: "Fetch your post", post: (userPost.concat(...friendPosts)) })

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })

    }
})
module.exports = router
