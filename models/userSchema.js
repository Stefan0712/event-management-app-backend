const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profilePictureUrl: {type: String},
    bio: {
        type: String,
        default: 'User has not set up a bio yet but we are sure he loves to have fun.'
    },
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    likedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    dislikedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
    

});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema)