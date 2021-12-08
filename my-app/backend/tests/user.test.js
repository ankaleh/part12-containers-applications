const mongoose = require('mongoose')
const User = require('../models/userModel')
const { createServer }  = require('../createServer')
const { createTestClient } = require('apollo-server-testing')

const mockData = { name: 'Mikko Mökkeilijä', username: 'mikmök', password: 'salasana' }

describe('Test User model', () => {
  beforeAll(async () => {
    //@shelf/jest-mongodb sets the process.env.MONGO_URL
    await mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Yhdistetty testitietokantaan.', process.env.MONGO_URL)
      })
      .catch((error) => {
        console.log('Virhe yhdistettäessä testitietokantaan: ', error.message)
      })

    await User.deleteMany({})
  })

  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('create and save user successfully', async () => {
    const validUser = new User(mockData)
    const savedUser = await validUser.save()
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined()
    expect(savedUser.name).toBe(mockData.name)
    expect(savedUser.username).toBe(mockData.username)
    expect(savedUser.password).toBe(mockData.password)
  })

  it('create user without required field fails', async () => {
    const userWithoutRequiredField = new User({ name: 'Mikko Mökkeilijä', password: 'salasana' })
    let validationError
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save()
    } catch (error) {
      validationError = error
    }
    expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(validationError.errors.username).toBeDefined()
  })

})

describe('Test server', () => {
  let server
  beforeAll(async () => {
    //@shelf/jest-mongodb sets the process.env.MONGO_URL
    server = await createServer(process.env.MONGO_URL)
    await User.deleteMany({})
    const { query, mutate } = createTestClient(server) //argumentiksi testi-ApolloServer
    const CREATE_USER = `
            mutation {
                createUser(name: "Mikko Mökkeilijä", username: "mikmök", password: "salasana")
            {
                name
                username
            }
            }
        `
    let response = await mutate({ mutation: CREATE_USER })
    expect(response.errors).toBeUndefined()

  })

  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('create user with non-unique username fails', async () => {
        const { query, mutate } = createTestClient(server); //argumentiksi testi-ApolloServer
        const CREATE_USER = `
            mutation {
                createUser(name: "Mikko Mökkeilijä", username: "mikmök", password: "salasana")
            {
                name
                username
            }
            }
        `
        let response = await mutate({ mutation: CREATE_USER })

        expect(response.errors).toBeDefined();
        //console.log(response)
        
    })
 
  it('login', async () => {
    const { query, mutate } = createTestClient(server)
    const LOGIN = `
        mutation {
            login(
              username: "mikmök"
              password: "salasana"
            ){
              value
            }
          }
        `
    let response = await mutate({ mutation: LOGIN })
    //console.log(response)
    expect(response.errors).toBeUndefined()
  })

})
