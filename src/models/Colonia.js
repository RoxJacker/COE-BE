import mongoose from 'mongoose'

const coloniaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      trim: true,
      // Ej: "Colonia", "Fraccionamiento", "Unidad Habitacional", "Pueblo", "Ejido"
    },
    codigoPostal: {
      type: String,
      trim: true,
    },
    claveOficina: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
  }
)

// Índice para búsqueda por nombre (autocompletar en formulario)
coloniaSchema.index({ nombre: 'text' })
coloniaSchema.index({ codigoPostal: 1 })

const Colonia = mongoose.model('Colonia', coloniaSchema)
export default Colonia
