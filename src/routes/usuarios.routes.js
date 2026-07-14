import { Router } from 'express'
import {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
} from '../controllers/usuarios.controller.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { soloRoles } from '../middleware/roles.middleware.js'

const router = Router()

// Proteger todas las rutas de usuarios - solo administradores pueden gestionar usuarios
router.use(verificarToken)
router.use(soloRoles('admin'))

// GET /api/usuarios
router.get('/', listar)

// GET /api/usuarios/:id
router.get('/:id', obtener)

// POST /api/usuarios
router.post('/', crear)

// PUT /api/usuarios/:id
router.put('/:id', actualizar)

// DELETE /api/usuarios/:id
router.delete('/:id', eliminar)

export default router
