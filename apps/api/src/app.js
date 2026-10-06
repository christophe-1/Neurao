// apps/api/src/app.js
import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors({ origin: process.env.WEB_ORIGIN }))
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

export default app