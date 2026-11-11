import { createClient } from 'redis'

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})

redisClient.on('error', (error) => {
  console.error('Erreur Redis :', error.code ?? error.message)
})

export default redisClient
