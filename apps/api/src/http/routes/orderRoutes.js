import { Router } from 'express'
import OrderController from '../controllers/OrderController.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import RedisSessionRepository from '../../infrastructure/repositories/RedisSessionRepository.js'
import SequelizeOrderRepository from '../../infrastructure/repositories/SequelizeOrderRepository.js'
import SequelizeProductRepository from '../../infrastructure/repositories/SequelizeProductRepository.js'

const productRepository = new SequelizeProductRepository()
const orderRepository = new SequelizeOrderRepository()
const sessionRepository = new RedisSessionRepository()
const controller = new OrderController(productRepository, orderRepository)
const router = Router()

router.post('/', requireAuth(sessionRepository), (req, res) => controller.create(req, res))

export default router
