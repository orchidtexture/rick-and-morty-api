const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const { typeDefs } = require('./graphql/typeDefs')
const { resolvers } = require('./graphql/resolvers')

const app = express()

async function start() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({app})

    const PORT = process.env.PORT || 8080

    app.listen(PORT, () =>
    console.log(`Server running on port: ${PORT}`)
    )
}

start()

module.exports = app
