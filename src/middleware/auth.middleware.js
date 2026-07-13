import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Sin token de autenticación' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const usuario = await Usuario.findById(decoded.id).select('-passwordHash')
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Token inválido o usuario inactivo' })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' })
  }
}
