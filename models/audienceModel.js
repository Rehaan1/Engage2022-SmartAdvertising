const mongoose = require('mongoose')

const Schema = mongoose.Schema

const audienceSchema = new Schema({
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
})

const Audience = mongoose.model('audience', audienceSchema)

module.exports = Audience
