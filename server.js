require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
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
        // validationRules: [handle.depth(2)],
        dataSources: () => ({
            character: new Character(),
            location: new Location(),
            episode: new Episode(),
        }),
        })

    await apolloServer.start();

    try {
        await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (error) {
        console.log(error)
    }

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use('/api', routes)


    apolloServer.applyMiddleware({ app })

    app.use(handle.error.notFound)
    app.use(handle.error.productionErrors)

    const PORT = process.env.PORT || 8080
    app.listen(PORT, () =>
    console.log(
    `Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    ),
    )

}

start()

module.exports = app