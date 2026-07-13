import { Router } from 'express'
import Colonia from '../models/Colonia.js'
import CatalogoIncidente from '../models/CatalogoIncidente.js'
import Dependencia from '../models/Dependencia.js'
import { verificarToken } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/catalogos/colonias?q=Ciudad+Granja
router.get('/colonias', verificarToken, async (req, res) => {
  try {
    const { q } = req.query
    const filtro = q ? { nombre: { $regex: q, $options: 'i' } } : {}
    const colonias = await Colonia.find(filtro)
      .select('nombre tipo codigoPostal')
      .sort({ nombre: 1 })
      .limit(50)
    res.json(colonias)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener colonias' })
  }
})

// GET /api/catalogos/incidentes?categoria=Protección Civil
router.get('/incidentes', verificarToken, async (req, res) => {
  try {
    const { categoria, subcategoria, q } = req.query
    const filtro = {}
    if (categoria) filtro.categoria = categoria
    if (subcategoria) filtro.subcategoria = subcategoria
    if (q) filtro.nombre = { $regex: q, $options: 'i' }
    const incidentes = await CatalogoIncidente.find(filtro)
      .sort({ categoria: 1, subcategoria: 1, nombre: 1 })
    res.json(incidentes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener catálogo de incidentes' })
  }
})

// GET /api/catalogos/incidentes/categorias — lista de categorías únicas
router.get('/incidentes/categorias', verificarToken, async (req, res) => {
  try {
    const categorias = await CatalogoIncidente.distinct('categoria')
    res.json(categorias.sort())
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías' })
  }
})

// GET /api/catalogos/dependencias
router.get('/dependencias', verificarToken, async (req, res) => {
  try {
    const { nivel } = req.query
    const filtro = { visibleEnUI: true }
    if (nivel) filtro.nivelGobierno = nivel
    const dependencias = await Dependencia.find(filtro).sort({ nivelGobierno: 1, nombreCorto: 1 })
    res.json(dependencias)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener dependencias' })
  }
})

export default router
