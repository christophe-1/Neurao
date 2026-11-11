import { Router } from 'express'
import AuthController from '../controllers/AuthController.js'
import RedisSessionRepository from '../../infrastructure/repositories/RedisSessionRepository.js'
import SequelizeUserRepository from '../../infrastructure/repositories/SequelizeUserRepository.js'

const userRepository = new SequelizeUserRepository()
const sessionRepository = new RedisSessionRepository()
const controller = new AuthController(userRepository, sessionRepository)
const router = Router()

router.post('/register', (req, res) => controller.register(req, res))
router.post('/login', (req, res) => controller.login(req, res))

export default router
