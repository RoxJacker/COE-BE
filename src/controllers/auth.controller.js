import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  })
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' })
    }

    // Buscar usuario incluyendo passwordHash (select: false en el schema)
    const usuario = await Usuario.findOne({ email }).select('+passwordHash')
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' })
    }

    const passwordValida = await usuario.compararPassword(password)
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' })
    }

    const token = generarToken(usuario._id, usuario.rol)

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        unidadAsignada: usuario.unidadAsignada,
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// POST /api/auth/registro (solo admin)
export const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol, unidadAsignada } = req.body

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' })
    }

    const existente = await Usuario.findOne({ email })
    if (existente) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' })
    }

    const nuevo = await Usuario.create({
      nombre,
      email,
      passwordHash: password, // el pre-save lo hashea
      rol,
      unidadAsignada: unidadAsignada || null,
    })

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: {
        id: nuevo._id,
        nombre: nuevo.nombre,
        email: nuevo.email,
        rol: nuevo.rol,
      },
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// GET /api/auth/perfil
export const perfil = async (req, res) => {
  res.json({
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      rol: req.usuario.rol,
      unidadAsignada: req.usuario.unidadAsignada,
    },
  })
}
