// apps/api/src/server.js
import app from './app.js'
import redisClient from './infrastructure/redis/client.js'

const PORT = process.env.PORT || 4000

await redisClient.connect()

app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  // To be replaced by an application logger later (ESLint no-console rule)
  console.log(`API démarrée sur le port ${PORT}`)
})
