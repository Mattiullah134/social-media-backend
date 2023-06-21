const mongoose = require('mongoose');


const postSchema = mongoose.Schema({

    userid: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 50
    },
    image: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: []

    }


}, { timestamps: true })
const Post = mongoose.model('Post', postSchema);
module.exports = Post;