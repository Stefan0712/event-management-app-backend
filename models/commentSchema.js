const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    authorUsername: {type: String},
    text: { type: String},
    createdAt: { type: Date, default: Date.now },
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
})

const Comment = mongoose.model('Comment', commentSchema)


module.exports = Comment;