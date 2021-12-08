const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true, minlength: 6 },
  password: { type: String, required: true },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    }
  ]
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', schema)