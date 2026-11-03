import { Router } from 'express'
import CategoryController from '../controllers/CategoryController.js'
import SequelizeCategoryRepository from '../../infrastructure/repositories/SequelizeCategoryRepository.js'

const repository = new SequelizeCategoryRepository()
const controller = new CategoryController(repository)
const router = Router()

router.get('/', (req, res) => controller.getAll(req, res))

export default router
