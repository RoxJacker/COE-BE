import mongoose from 'mongoose'

const catalogoIncidenteSchema = new mongoose.Schema(
  {
    codigo_cnie: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    subcategoria: {
      type: String,
      required: true,
    },
    prioridadSugerida: {
      type: String,
      enum: ['Baja', 'Media', 'Alta', 'Crítica'],
      required: true,
    },
    descripcion: {
      type: String,
      default: '',
    },
    protocolo_coe: {
      type: String,
      default: '',
    },
    unidades_despacho: {
      type: [String],
      default: [],
    },
    tiempoRespuestaObjetivo: {
      type: Number, // minutos
      default: null,
    },
    requiereSINAPROC: {
      type: Boolean,
      default: false,
    },
    palabrasClave: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: false,
  }
)

// Índice de texto para búsqueda en formulario de operador
catalogoIncidenteSchema.index({ nombre: 'text', palabrasClave: 'text' })
catalogoIncidenteSchema.index({ categoria: 1, subcategoria: 1 })

const CatalogoIncidente = mongoose.model('CatalogoIncidente', catalogoIncidenteSchema)
export default CatalogoIncidente
