const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 5
  },
  writtenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  unidentifiedGuests: {
    type: [String]
  },
  guests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Post', schema)