// const baseUrl = 'https://rickandmortyapi.com/api'
const baseUrl = 'http://localhost:8080/api'

const message = {
  noPage: 'There is nothing here',
  noCharacter: 'Character not found',
  noLocation: 'Location not found',
  noEpisode: 'Episode not found',
  badParam: 'Hey! you must provide an id',
  badArray: 'Bad... bad array :/',
}

const collection = {
  exclude: '-author -__v -edited',
  limit: 20,
  queries: {
    character: ['id', 'name', 'status', 'species', 'type', 'gender'],
    episode: ['name', 'episode'],
    location: ['name', 'dimension', 'type'],
  },
}

module.exports = {
  baseUrl,
  message,
  collection,
}