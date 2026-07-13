import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      select: false, // no se devuelve en queries por defecto
    },
    rol: {
      type: String,
      enum: ['operador', 'campo', 'admin'],
      required: true,
    },
    unidadAsignada: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unidad',
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

// Comparar contraseña
usuarioSchema.methods.compararPassword = async function (passwordPlano) {
  return await bcrypt.compare(passwordPlano, this.passwordHash)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
