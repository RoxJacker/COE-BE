import mongoose from 'mongoose'

const reporteGuardiaSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },
    turno: {
      type: String,
      enum: ['matutino', 'vespertino', 'nocturno'],
      required: true,
    },
    operadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    emergenciasAtendidas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergencia',
      },
    ],
    novedades: {
      type: String,
      default: '',
    },
    tiempoPromedioRespuesta: {
      type: Number, // minutos
      default: 0,
    },
    generadoEn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const ReporteGuardia = mongoose.model('ReporteGuardia', reporteGuardiaSchema)
export default ReporteGuardia
