const mongoose = require('mongoose');
 

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorUsername: {type: String},
    text: { type: String},
    createdAt: { type: Date, default: Date.now },
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})

const Post = mongoose.model('Post', postSchema)


module.exports = Post;