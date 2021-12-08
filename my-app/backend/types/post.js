const { UserInputError, AuthenticationError, gql } = require('apollo-server')
const Post = require('../models/postModel')
const User = require('../models/userModel')

const typeDefs = gql`
    type Post {
        id: ID!,
        writtenBy: User!,
        startDate: String!,
        endDate: String!,
        text: String!,
        unidentifiedGuests: [String],
        guests: [User],
    }
    extend type Query {
        postCount: Int!
        allPosts: [Post!]!
        guestsAndUnidentifiedGuests: [String]!
    }

    extend type Mutation {
        addPost(
            startDate: String!,
            endDate: String!
            text: String!,
            unidentifiedGuests: [String]
            guests: [ID]
        ): Post,
        removePost(
          id: ID!
        ): Post
    }
`
const resolvers = {
  Mutation: {
    addPost: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated backend.postissa!')
      }
      const post = new Post({ ...args, writtenBy: currentUser } )

      if (post.startDate instanceof Date && post.endDate instanceof Date) {
        console.log('uusi merkintä luotu', post.text)
      } else {
        console.log(post.validateSync().errors['startDate'])
        console.log(post.validateSync().errors['endDate'])
      }

      const guests = post.guests //lista id:itä

      try {
        await post.save()
        //lisätään vieraiden vieraskirjamerkintälistoihin:
        /* guests.forEach(async id => {
          try {
            console.log('id: ', id)
            const guest = await User.findById(id)
            console.log(guest.name)
            guest.posts = guest.posts.concat(post)
            await guest.save()
          } catch (e) {
            console.log(e)
          }

        }) */

        //lisätään kirjoittajan eli currentUserin merkintöihin:
        currentUser.posts = currentUser.posts.concat(post)
        await currentUser.save()
      } catch (error) {
        console.log('catchissa: tallentaminen ei onnistunut', error)
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return post
    },
    removePost: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }

      try {
        const post = await Post.findById(args.id)

        //poistetaan kirjoittajan merkinnöistä:
        const postIndex = await currentUser.posts.indexOf(post)
        await currentUser.posts.splice(postIndex, 1)
        await currentUser.save()

        //poistetaan vieraiden merkinnöistä:
        /* const guests = post.guests //lista id:itä
          guests.forEach(async id => {
            try {
              const guest = await User.findById(id)
              const postIndex = await guest.posts.indexOf(post)
              await guest.posts.splice(postIndex, 1)
              await guest.save()
            } catch (e) {
              console.log(e)
            }

          }) */

        return Post.findByIdAndRemove(args.id)
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }
  },
  Query: {
    postCount: () => {
      return Post.collection.countDocuments()
    },
    allPosts: (root, args, { currentUser }) => { //tähän kirjautumisvaatimus!!!
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated backend.postissa!')
      }
      return Post.find({})
    }
  },
  Post: {
    writtenBy: async (root, args, { currentUser }) => {
      const user = await User.findById(root.writtenBy)
      return user
    },
    guests: async (root, args, { currentUser }) => {
      const guestsIds = root.guests
      const usersInDatabase = await User.find({ _id: { $in: guestsIds } })
      return usersInDatabase
    }

  }
}

module.exports = { typeDefs, resolvers }
