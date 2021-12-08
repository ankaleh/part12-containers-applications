const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express')
  .default

const { makeExecutableSchema } = require('apollo-server')
const merge  = require('lodash/merge')

const app = express()

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const post = require('./types/post')
const task = require('./types/task')
const user = require('./types/user')
const reservation = require('./types/reservation')

const User = require('./models/userModel')

const config = require('./config')
const secret = config.SECRET

const createServer = async (mongoUri) => {

  await mongoose.connect(mongoUri,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
      console.log('Yhdistetty tietokantaan.')
    })
    .catch((error) => {
      console.log('Virhe yhdistettäessä tietokantaan: ', error.message)
    })

  const Query =`
    type Query {
        _empty: String
    }
  `
  const Mutation = `
    type Mutation {
        _empty: String
    }
  `
  const schema = makeExecutableSchema({
    typeDefs: [ task.typeDefs, post.typeDefs, user.typeDefs, reservation.typeDefs, Query, Mutation ],
    resolvers: merge(user.resolvers, post.resolvers, task.resolvers, reservation.resolvers),
  })

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
    // authiin asetetaan pyynnön Authorization-otsakkeen tiedot eli token,
    //ja jos headerina ei tule validia tokenia, kysely vastaa "null":
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer')) {
        const decodedToken = jwt.verify(auth.substring(7), secret)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser } //contextin kentäksi
      }
    },
    cors: true,
  })

  if (config.environment==='development') {
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
  }

  server.applyMiddleware({ app })
  return app
}

module.exports.createServer = createServer