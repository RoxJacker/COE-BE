import mongoose from 'mongoose'

const dependenciaSchema = new mongoose.Schema(
  {
    clave: {
      type: String,
      required: true,
      unique: true,
      // Ej: "DEP-001"
    },
    nombreCorto: {
      type: String,
      required: true,
      trim: true,
    },
    nombreOficial: {
      type: String,
      required: true,
      trim: true,
    },
    nivelGobierno: {
      type: String,
      enum: ['Municipal', 'Estatal', 'Federal', 'Privado / Voluntariado'],
      required: true,
    },
    tipoServicio: {
      type: String,
      required: true,
    },
    estadoOperativo: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      default: 'Activo',
    },
    descripcion: {
      type: String,
      default: '',
    },
    visibleEnUI: {
      type: Boolean,
      default: true,
    },
    grupoUI: {
      type: String,
      default: '',
    },
    iconoSugerido: {
      type: String,
      default: 'shield',
    },
  },
  {
    timestamps: false,
  }
)

const Dependencia = mongoose.model('Dependencia', dependenciaSchema)
export default Dependencia
