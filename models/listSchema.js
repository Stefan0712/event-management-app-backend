const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: { type: String},
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    eventCreator:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    suggestedTasks: [mongoose.Schema.Types.ObjectId]
})

const List = mongoose.model('List', listSchema)


module.exports = List;