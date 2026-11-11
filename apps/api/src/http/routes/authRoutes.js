import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'
import SequelizeUserRepository from '../../infrastructure/repositories/SequelizeUserRepository.js'

const repository = new SequelizeUserRepository()
const controller = new AuthController(repository)
const router = Router()

router.post('/register', (req, res) => controller.register(req, res))

export default router
