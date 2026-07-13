// Middleware que restringe acceso por rol
// Uso: router.delete('/...', verificarToken, soloRoles('admin'), handler)
export const soloRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      })
    }
    next()
  }
}
