require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')

const app = express()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { Character, Location, Episode } = require('./graphql/sources')

const handle = require('./handlers')
const routes = require('./routes')

async function start() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        // validationRules: [handle.depth(1)],
        dataSources: () => ({
            character: new Character(),
            location: new Location(),
            episode: new Episode(),
        }),
        })

    await apolloServer.start();

    try {
        console.log(process.env.DATABASE)
        await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
        // mongoose.Promise = global.Promise
    } catch (error) {
        console.log(error)
    }
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use('/api', routes)

    apolloServer.applyMiddleware({ app })

    app.use(handle.error.notFound)
    app.use(handle.error.productionErrors)

    const PORT = process.env.PORT || 8080
    app.listen(PORT, () =>
    console.log(
        '\x1b[34m%s\x1b[0m',
        `
    ${app.get('env').toUpperCase()}

    REST      → http://localhost:${PORT}/api/
    GraphQL   → http://localhost:${PORT}${apolloServer.graphqlPath}/
    Database  → ${mongoose.connection.host}/${mongoose.connection.name}
    `,
    ),
    )

}

start()

module.exports = app