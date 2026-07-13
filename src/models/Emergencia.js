import mongoose from 'mongoose'

// Genera folio automático: EMG-2026-0001
const generarFolio = async () => {
  const año = new Date().getFullYear()
  const prefijo = `EMG-${año}-`
  const ultimo = await Emergencia.findOne(
    { folio: { $regex: `^${prefijo}` } },
    { folio: 1 },
    { sort: { folio: -1 } }
  )
  if (!ultimo) return `${prefijo}0001`
  const num = parseInt(ultimo.folio.split('-')[2]) + 1
  return `${prefijo}${String(num).padStart(4, '0')}`
}

const emergenciaSchema = new mongoose.Schema(
  {
    folio: {
      type: String,
      unique: true,
    },
    // Referencia al catálogo de incidentes
    catalogoIncidente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CatalogoIncidente',
      default: null,
    },
    tipo: {
      type: String,
      required: [true, 'El tipo de emergencia es requerido'],
    },
    subtipo: {
      type: String,
      default: '',
    },
    ubicacion: {
      calle: { type: String, default: '' },
      numeroExterior: { type: String, default: '' },
      numeroInterior: { type: String, default: '' },
      colonia: { type: String, default: '' },
      referencias: { type: String, default: '' },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      direccionCompleta: { type: String, default: '' }
    },
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta', 'critica'],
      required: true,
    },
    estado: {
      type: String,
      enum: ['nuevo', 'asignado', 'en_atencion', 'cerrado'],
      default: 'nuevo',
    },
    unidadAsignada: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unidad',
      default: null,
    },
    dependenciasApoyo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependencia',
      },
    ],
    operadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    personas: { type: Number, default: 0 },
    animales: { type: Number, default: 0 },
    notas: { type: String, default: '' },
    telefonoContacto: { type: String, default: '' },
    nombreContacto: { type: String, default: '' },
    // Timestamps de negocio
    tiempoReporte: { type: Date, default: Date.now },
    tiempoAsignacion: { type: Date, default: null },
    tiempoCierre: { type: Date, default: null },
    // Telegram: si ya se envió el mensaje de despacho
    telegramEnviado: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Pre-save: asigna folio automático
emergenciaSchema.pre('save', async function (next) {
  if (!this.folio) {
    this.folio = await generarFolio()
  }
  next()
})

// Índices útiles para queries del dashboard
emergenciaSchema.index({ estado: 1 })
emergenciaSchema.index({ tiempoReporte: -1 })

const Emergencia = mongoose.model('Emergencia', emergenciaSchema)
export default Emergencia
