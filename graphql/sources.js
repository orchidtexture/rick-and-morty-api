const { RESTDataSource } = require('apollo-datasource-rest')

const baseUrl = `http://localhost:${process.env.PORT || 8080}/api`

class Character extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/character`
  }

  async characters({ page }) {
    return this.get('/', { page })
  }
  async charactersByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async character({ id }) {
    return this.get('/' + id)
  }
}

class Location extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/location`
  }

  async locations({ filter, page }) {
    return this.get('/', { page })
  }
  async locationsByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async location({ id }) {
    return this.get('/' + id)
  }
}

class Episode extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/episode`
  }

  async episodes({ filter, page }) {
    return this.get('/', { page })
  }
  async episodesByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async episode({ id }) {
    return this.get('/' + id)
  }
}

module.exports = { Character, Location, Episode }