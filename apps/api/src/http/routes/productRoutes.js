import { Router } from 'express'
import ProductController from '../controllers/ProductController.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireRole } from '../middlewares/requireRole.js'
import RedisSessionRepository from '../../infrastructure/repositories/RedisSessionRepository.js'
import SequelizeProductRepository from '../../infrastructure/repositories/SequelizeProductRepository.js'

const repository = new SequelizeProductRepository()
const controller = new ProductController(repository)
const sessionRepository = new RedisSessionRepository()
const router = Router()

router.get('/', (req, res) => controller.getAll(req, res))
router.get('/:id', (req, res) => controller.getOne(req, res))
router.patch(
  '/:id/deactivate',
  requireAuth(sessionRepository),
  requireRole(['admin', 'manager']),
  (req, res) => controller.deactivate(req, res),
)

export default router
