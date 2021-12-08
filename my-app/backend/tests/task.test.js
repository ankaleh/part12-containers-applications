const mongoose = require('mongoose')
const User = require('../models/userModel')
const Task = require('../models/taskModel')

const mockUser = { name: 'Mikko Mökkeilijä', username: 'mikmök', password: 'salasana' }
const mockTask = { description: 'Ikkunoiden pesu', done: false }

describe('Test Task Model', () => {
  let user
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Yhdistetty testitietokantaan.', process.env.MONGO_URL)
      })
      .catch((error) => {
        console.log('Virhe yhdistettäessä testitietokantaan: ', error.message)
      })

    await User.deleteMany({})
    await Task.deleteMany({})
    user = new User(mockUser)
    await user.save()
  })

  afterAll(async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await mongoose.connection.close()
  })

  it('create and save task successfully', async () => {
    const validTask = new Task({ ...mockTask, addedBy: user })
    const savedTask = await validTask.save()
    expect(savedTask._id).toBeDefined()
    expect(savedTask.desciption).toBe(mockTask.desciption)
    expect(savedTask.done).toBe(mockTask.done)
    expect(savedTask.addedBy).toBe(user)
  })

  it('create task without required field fails', async () => {
    const taskWithoutRequiredField = new Task({ done: false, addedBy: user })
    let validationError
    try {
      const savedTaskWithoutRequiredField = await taskWithoutRequiredField.save()
    } catch (error) {
      validationError = error
    }
    expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(validationError.errors.description).toBeDefined()
  })
})
