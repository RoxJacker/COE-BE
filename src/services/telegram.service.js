export const enviarActualizacionTelegram = async (emergencia, unidad, estadoOverride = null) => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('⚠️ Credenciales de Telegram no configuradas. Saltando envío de mensaje.')
    return
  }

  // Format date and time
  const now = new Date()
  const date = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  // Determine state
  const estado = estadoOverride || emergencia.estado // 'nuevo', 'asignado', 'en_atencion', 'cerrado'

  // Emojis and actions based on state
  let emoji = '🟡'
  let actions = `Se despacha unidad ${unidad?.nombre || 'asignada'} para atención.`

  if (estado === 'en_atencion') {
    emoji = '🔴'
    actions = `Unidad ${unidad?.nombre || 'asignada'} arribó al lugar. Estado: TRABAJANDO EN ESCENA.`
  } else if (estado === 'cerrado') {
    emoji = '🟢'
    actions = `Servicio finalizado y cerrado. Unidad ${unidad?.nombre || 'asignada'} retorna a base / disponible.`
  }

  // Extract relevant fields safely
  const type = emergencia.catalogoIncidente?.nombre || emergencia.tipo || 'INCIDENTE'
  const notes = emergencia.notas || 'Sin notas.'
  
  let recursos = unidad?.nombre || 'Unidad asignada'
  if (emergencia.dependenciasApoyo && emergencia.dependenciasApoyo.length > 0) {
    const nombresDeps = emergencia.dependenciasApoyo.map(d => d.nombreCorto || 'Apoyo').join(', ')
    recursos = `${recursos}, ${nombresDeps}`
  }

  // Construir ubicacion concatenada manualmente
  const calle = emergencia.ubicacion?.calle || ''
  const numExt = emergencia.ubicacion?.numeroExterior ? ` #${emergencia.ubicacion.numeroExterior}` : ''
  const numInt = emergencia.ubicacion?.numeroInterior ? ` Int. ${emergencia.ubicacion.numeroInterior}` : ''
  const col = emergencia.ubicacion?.colonia || ''
  const refs = emergencia.ubicacion?.referencias ? `\n(Ref: ${emergencia.ubicacion.referencias})` : ''
  const ubicacionTexto = `${calle}${numExt}${numInt}, Col. ${col}${refs}`

  // Build the exact format requested
  const message = `${emoji} ACTUALIZACION / ${type}
${date} | ${time} hrs

📍 UBICACIÓN:
${ubicacionTexto}
📝 SITUACIÓN:
${notes}
🛡️ ACCIONES:
${actions}
🚑 RECURSOS MOVILIZADOS:
* ${recursos}
-EN EL INCIDENTE-`

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Error de Telegram API:', errorData)
    } else {
      console.log(`✅ Mensaje de Telegram (${estado}) enviado correctamente.`)
    }
  } catch (error) {
    console.error('❌ Excepción al enviar mensaje a Telegram:', error)
  }
}

export const enviarDespacho = async (emergencia, unidad) => {
  return enviarActualizacionTelegram(emergencia, unidad, 'asignado')
}
