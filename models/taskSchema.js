const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
      },
      description: {
        type: String
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      authorUsername: {type: String},
      createdAt: {
        type: Date,
        default: Date.now
      },
      deadline: {
        type: Date 
      },
      priority: {
        type: String,
        enum: ['low', 'standard', 'high', 'unset'],
        default: 'unset'
      },
      status: {
        type: String,
        enum: ['not-started', 'started', 'finished', 'dropped'],
        default: 'not-started'
      },
      isCompleted: {
        type: Boolean,
        default: false
      }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;