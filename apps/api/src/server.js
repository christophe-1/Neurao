// apps/api/src/server.js
import app from './app.js'
import redisClient from './infrastructure/redis/client.js'

const PORT = process.env.PORT ?? 4000

await redisClient.connect()

app.listen(PORT, () => {
  // Remplacé par un journal applicatif plus tard (règle ESLint no-console)
  console.log(`API démarrée sur le port ${PORT}`)
})
