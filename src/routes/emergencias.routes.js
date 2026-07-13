import { Router } from 'express'
import {
  listar,
  listarActivas,
  obtenerEstadisticas,
  obtener,
  crear,
  actualizar,
  asignarUnidad,
  cambiarEstado,
} from '../controllers/emergencias.controller.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { soloRoles } from '../middleware/roles.middleware.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(verificarToken)

// GET /api/emergencias/stats    — debe ir ANTES de /:id
router.get('/stats', obtenerEstadisticas)

// GET /api/emergencias/activas  — debe ir ANTES de /:id
router.get('/activas', listarActivas)

// GET    /api/emergencias
router.get('/', listar)

// GET    /api/emergencias/:id
router.get('/:id', obtener)

// POST   /api/emergencias  — solo operador/admin
router.post('/', soloRoles('operador', 'admin'), crear)

// PUT    /api/emergencias/:id  — solo operador/admin
router.put('/:id', soloRoles('operador', 'admin'), actualizar)

// PATCH  /api/emergencias/:id/asignar
router.patch('/:id/asignar', soloRoles('operador', 'admin'), asignarUnidad)

// PATCH  /api/emergencias/:id/estado
router.patch('/:id/estado', soloRoles('operador', 'admin', 'campo'), cambiarEstado)

export default router
