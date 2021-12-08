const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    minlength: 5
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  doneBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  done: {
    type: Boolean,
    required: true
  }

})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', schema)