import mongoose from 'mongoose'

const unidadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la unidad es requerido'],
      trim: true,
    },
    tipo: {
      type: String,
      required: true,
      // Ej: "Bomba", "Ambulancia", "Rescate", "Pipas", "Mando"
    },
    base: {
      type: String,
      required: true,
      // Ej: "Base 1 - Zapopan Centro", "Base 2 - Tesistán"
    },
    estado: {
      type: String,
      enum: ['disponible', 'en_camino', 'en_escena', 'regresando', 'fuera_de_servicio'],
      default: 'disponible',
    },
    responsable: {
      type: String,
      trim: true,
    },
    turno: {
      type: String,
      enum: ['matutino', 'vespertino', 'nocturno'],
    },
    ultimaUbicacion: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      actualizadoEn: { type: Date, default: null },
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Unidad = mongoose.model('Unidad', unidadSchema)
export default Unidad
