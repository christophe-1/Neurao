// apps/api/src/app.js
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import productRoutes from './http/routes/productRoutes.js'
import categoryRoutes from './http/routes/categoryRoutes.js'
import authRoutes from './http/routes/authRoutes.js'
import { errorHandler } from './http/middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.WEB_ORIGIN }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)
export default app
