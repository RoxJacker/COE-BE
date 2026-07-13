import { Router } from 'express'
import { login, registro, perfil } from '../controllers/auth.controller.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { soloRoles } from '../middleware/roles.middleware.js'

const router = Router()

// POST /api/auth/login — público
router.post('/login', login)

// POST /api/auth/registro — solo admin
router.post('/registro', verificarToken, soloRoles('admin'), registro)

// GET /api/auth/perfil — cualquier usuario autenticado
router.get('/perfil', verificarToken, perfil)

export default router
