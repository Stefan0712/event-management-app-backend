const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "Unset"},
  duration: { type: String, default: "Unset"},
  location: { type: String, default: "Unset"},
  eventCountry: { type: String, default: ""},
  eventRegion:{ type: String, default: ""},
  eventCity:{ type: String, default: ""},
  minParticipants: { type: Number, default: 1, min: 1},
  maxParticipants: { type: Number, max: 100},
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 1 }],
  requirements: {type: String, default: "None"},
  isPublic: {type: Boolean, default: false},
  isStarted: {type: Boolean, default: false},
  isOpen: {type: Boolean, default: true},
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  schedule: [{type: Object}],
  rules: [{type: Object}],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

module.exports = mongoose.model('Event', eventSchema);
