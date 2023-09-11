const checkArray = (res) => (Array.isArray(res) ? res : [res])

const handleInfo = ({ stats }) => {
  const getPage = (url) => {
    const params = new URL(url)
    return parseInt(params.searchParams.get('page'))
  }

  return {
    ...stats,
    next: () => (stats && stats.next ? getPage(stats.next) : null),
    prev: () => (stats && stats.prev ? getPage(stats.prev) : null),
  }
}

const resolvers = {
  Query: {
    characters: async (_, { page }, { dataSources }) => {
      const { results, info: stats } = await dataSources.character
        .characters({ page })
        .catch((error) => { results: [] })

      const info = handleInfo({ stats })
      return { results, info }
    },
    charactersByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.character.charactersByIds({ ids }).catch((error) => [])
    },
    character: async (_, { id }, { dataSources }) => {
        return dataSources.character.character({ id }).catch((error) => null)
    },
    locations: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.location
        .locations({ page, filter })
        .catch((error) => { results: [] })

      const info = handleInfo({ stats })
      return { results, info }
    },
    locationsByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.location.locationsByIds({ ids }).catch((error) => [])
    },
    location: async (_, { id }, { dataSources }) => {
      return dataSources.location.location({ id }).catch((error) => null)
    },
    episodes: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.episode
        .episodes({ page, filter })
        .catch((error) => { results: [] })
      const info = handleInfo({ stats })
      return { results, info }
    },
    episodesByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.episode.episodesByIds({ ids }).catch((error) => [])
    },
    episode: async (_, { id }, { dataSources }) => {
      return dataSources.episode.episode({ id }).catch((error) => null)
    },
  },
  Character: {
    episode: async ({ episode }, _, { dataSources }) => {
        const res = await dataSources.episode.episode({ id: episode[0] })
      return checkArray(res)
    },
    location: async ({ location }) => {return location},
    origin: async ({ origin }) => { return origin },
  },
  Location: {
    residents: async ({ residents }, _, { dataSources }) => {
      if (!residents || (residents && !residents.length)) return []
      const res = await dataSources.character.charactersByIds({ ids: residents })
      return checkArray(res)
    },
  },
  Episode: {
    characters: async ({ characters }, _, { dataSources }) => {
        return await dataSources.character.charactersByIds({ ids: characters })
    },
  },
}

module.exports = resolvers