const { UserInputError, gql, AuthenticationError } = require('apollo-server')
const User = require('../models/userModel')

const bqrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const secret = config.NODE_ENV === 'test'
  ? 'kukkanen'
  : config.SECRET


const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        username: String!
        password: String!
        tasks: [ Task ]
        posts: [ Post ]
    }
    type Token {
        value: String!
    }
    extend type Query {
        me: User
        allUsers: [User!]!
    }
    extend type Mutation {
        createUser(
            name: String!
            username: String!
            password: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`

const resolvers = {
  Mutation: {
    createUser: async (root, args) => {
      const salt = 10
      const passwordHash = await bqrypt.hash(args.password, salt)
      const newUser = new User({ name: args.name, username: args.username, password: passwordHash })
      try {
        await newUser.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return newUser
    },
    login: async (root, args) => {
      const userLoggingIn = await User.findOne({ username: args.username })
      const passwordCorrect = userLoggingIn === null
        ? false
        : await bqrypt.compare(args.password, userLoggingIn.password)

      if ( !(userLoggingIn && passwordCorrect) ) {
        throw new UserInputError('Wrong credentials!')
      }
      //console.log('login: ', userLoggingIn.username, userLoggingIn._id)
      const userForToken = { username: userLoggingIn.username, id: userLoggingIn._id }
      //console.log(`token: "bearer ${jwt.sign(userForToken, secret)}"`)
      return { value: jwt.sign(userForToken, secret, /* { expiresIn: 1200 } */) } //palautetaan skeemassa määritetyn Token-tyypin kenttä value
    }

  },
  Query: {
    me: (root, args, { currentUser }) => {
      return currentUser
    },
    allUsers: (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }
      return User.find({})
    }

  }
}

module.exports = { typeDefs, resolvers }