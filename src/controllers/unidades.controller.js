import Unidad from '../models/Unidad.js'

// GET /api/unidades
export const listar = async (req, res) => {
  try {
    const { estado, turno } = req.query
    const filtro = { activa: true }
    if (estado) filtro.estado = estado
    if (turno) filtro.turno = turno

    const unidades = await Unidad.find(filtro).sort({ nombre: 1 })
    res.json(unidades)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener unidades' })
  }
}

// GET /api/unidades/disponibles — para el selector de despacho
export const disponibles = async (req, res) => {
  try {
    const unidades = await Unidad.find({
      activa: true,
      estado: 'disponible',
    }).sort({ nombre: 1 })
    res.json(unidades)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener unidades disponibles' })
  }
}

// GET /api/unidades/:id
export const obtener = async (req, res) => {
  try {
    const unidad = await Unidad.findById(req.params.id)
    if (!unidad) return res.status(404).json({ mensaje: 'Unidad no encontrada' })
    res.json(unidad)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener unidad' })
  }
}

// POST /api/unidades — solo admin
export const crear = async (req, res) => {
  try {
    const { nombre, tipo, base, responsable, turno } = req.body
    if (!nombre || !tipo || !base) {
      return res.status(400).json({ mensaje: 'nombre, tipo y base son requeridos' })
    }
    const unidad = await Unidad.create({ nombre, tipo, base, responsable, turno })
    res.status(201).json(unidad)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear unidad' })
  }
}

// PUT /api/unidades/:id
export const actualizar = async (req, res) => {
  try {
    const unidad = await Unidad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!unidad) return res.status(404).json({ mensaje: 'Unidad no encontrada' })
    res.json(unidad)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar unidad' })
  }
}

// PATCH /api/unidades/:id/estado — unidad en campo actualiza su propio estado
export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body
    const estadosValidos = ['disponible', 'en_camino', 'en_escena', 'regresando', 'fuera_de_servicio']
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido' })
    }

    const unidad = await Unidad.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    )
    if (!unidad) return res.status(404).json({ mensaje: 'Unidad no encontrada' })

    if (req.io) {
      req.io.emit('unidad:estado', { unidadId: req.params.id, estado })
    }

    res.json(unidad)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado' })
  }
}

// DELETE /api/unidades/:id — solo admin (soft delete)
export const eliminar = async (req, res) => {
  try {
    const unidad = await Unidad.findByIdAndUpdate(
      req.params.id,
      { activa: false },
      { new: true }
    )
    if (!unidad) return res.status(404).json({ mensaje: 'Unidad no encontrada' })
    res.json({ mensaje: 'Unidad desactivada correctamente', unidad })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar unidad' })
  }
}
