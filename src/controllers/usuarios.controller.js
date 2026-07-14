import Usuario from '../models/Usuario.js'

// GET /api/usuarios
export const listar = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ activo: true })
      .populate('unidadAsignada', 'nombre tipo')
      .sort({ nombre: 1 })
    res.json(usuarios)
  } catch (error) {
    console.error('Error al listar usuarios:', error)
    res.status(500).json({ mensaje: 'Error al obtener usuarios' })
  }
}

// GET /api/usuarios/:id
export const obtener = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.params.id, activo: true })
      .populate('unidadAsignada', 'nombre tipo')
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
    res.json(usuario)
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({ mensaje: 'Error al obtener usuario' })
  }
}

// POST /api/usuarios
export const crear = async (req, res) => {
  try {
    const { nombre, email, password, rol, unidadAsignada } = req.body

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Nombre, email, contraseña y rol son requeridos' })
    }

    const existente = await Usuario.findOne({ email })
    if (existente) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' })
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      passwordHash: password, // Pre-save handles hash
      rol,
      unidadAsignada: unidadAsignada || null
    })

    const respuesta = usuario.toObject()
    delete respuesta.passwordHash

    res.status(201).json(respuesta)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({ mensaje: 'Error al crear usuario' })
  }
}

// PUT /api/usuarios/:id
export const actualizar = async (req, res) => {
  try {
    const { nombre, email, password, rol, unidadAsignada, activo } = req.body
    
    const usuario = await Usuario.findOne({ _id: req.params.id, activo: true })
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }

    if (email && email !== usuario.email) {
      const existente = await Usuario.findOne({ email })
      if (existente) {
        return res.status(409).json({ mensaje: 'El email ya está en uso' })
      }
      usuario.email = email
    }

    if (nombre) usuario.nombre = nombre
    if (rol) usuario.rol = rol
    if (unidadAsignada !== undefined) usuario.unidadAsignada = unidadAsignada || null
    if (activo !== undefined) usuario.activo = activo

    if (password) {
      usuario.passwordHash = password // Trigger pre-save hash
    }

    await usuario.save()

    const respuesta = usuario.toObject()
    delete respuesta.passwordHash

    res.json(respuesta)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({ mensaje: 'Error al actualizar usuario' })
  }
}

// DELETE /api/usuarios/:id
export const eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    )
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
    res.json({ mensaje: 'Usuario desactivado correctamente', usuario })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ mensaje: 'Error al desactivar usuario' })
  }
}
