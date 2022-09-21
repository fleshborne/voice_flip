const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
  name: {
    type: String,
  },
  home: {
    type: String,
  },
  country: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: String,
  },
  voice: {
    type: String,
  },
  pitch: {
    type: String,
  },
  pace: {
    type: String,
  },
  voiceWish: {
    type: String,
  },
  filename: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('guests', GuestSchema);
