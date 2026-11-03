// apps/api/src/app.js
import cors from 'cors'
import express from 'express'
import productRoutes from './http/routes/productRoutes.js'
import categoryRoutes from './http/routes/categoryRoutes.js'

const app = express()

app.use(cors({ origin: process.env.WEB_ORIGIN }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

export default app
