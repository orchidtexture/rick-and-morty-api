require('dotenv').config()

const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { connect, default: mongoose } = require('mongoose')

const { typeDefs } = require('./graphql/typeDefs')
const { resolvers } = require('./graphql/resolvers')

const db = process.env.DATABASE

const app = express()

async function start() {
    // DB connection
    try {
        await connect(db)
        console.log('mongodb connected')
    } catch (error) {
        console.log(error)
    }

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({app})
    
    app.use('*', (req, res) => res.status(404).send('Not found'))

    const PORT = process.env.PORT || 8080

    app.listen(PORT, () =>
    console.log(`Server running on port: ${PORT}`)
    )
}


start()

module.exports = app
