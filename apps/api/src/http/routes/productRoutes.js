import { Router } from 'express'
import ProductController from '../controllers/ProductController.js'
import SequelizeProductRepository from '../../infrastructure/repositories/SequelizeProductRepository.js'

const repository = new SequelizeProductRepository()
const controller = new ProductController(repository)
const router = Router()

router.get('/', (req, res) => controller.getAll(req, res))
router.get('/:id', (req, res) => controller.getOne(req, res))

export default router
