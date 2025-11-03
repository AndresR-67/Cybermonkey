Archivo: src/services/gamificacionService.js
-------------------------------------------
- otorgarXP(id_usuario, xpGanado, motivo)
    * Otorga XP a un usuario.
    * Recalcula el nivel.
    * Registra log en Mongo.
  
- aplicarPenalizacion(id_usuario, tipo, motivo)
    * Aplica penalización de XP según tipo.
    * Evita que XP sea menor a 0.
    * Registra log en Mongo.

- actualizarRachaUsuario(id_usuario, fechaActual)
    * Calcula y actualiza racha diaria de un usuario.
    * Reinicia racha si hay inactividad.
    * Registra log en Mongo.

- otorgarMedalla(id_usuario, id_medalla)
    * Asigna medalla a un usuario.
    * Registra log en Mongo.

- otorgarLogro(id_usuario, id_logro)
    * Asigna logro a un usuario.
    * Registra log en Mongo.

- obtenerProgresoCompleto(id_usuario)
    * Devuelve progreso completo + recompensas del usuario.

- procesarActividadCompletada(id_usuario, actividad)
    * Determina XP según prioridad de la actividad.
    * Llama a otorgarXP para sumar XP y registrar log.

Archivo: src/controllers/actividadController.js
-----------------------------------------------
- completarActividad(req, res)
    * Marca actividad como completada.
    * Crea registro en historial.
    * Llama a procesarActividadCompletada para sumar XP.

Archivo: src/controllers/gamificacionController.js
--------------------------------------------------
- otorgarRecompensa(req, res)
    * Permite a un admin otorgar XP manual a un usuario.
    * Llama a gamificacionService.otorgarXP.

Archivo: src/models/gamificacionModel.js
----------------------------------------
- actualizarXP(id_usuario, cantidad)
    * Suma/resta XP en SQL.
    * Retorna XP actualizado.
- actualizarNivel(id_usuario, nivel)
    * Actualiza nivel del usuario en SQL.
- asignarMedalla(id_usuario, id_medalla)
    * Asigna medalla en SQL.
- asignarLogro(id_usuario, id_logro)
    * Asigna logro en SQL.
- getProgresoUsuario(id_usuario)
    * Obtiene XP, nivel, racha y recompensas actuales del usuario.
- getRecompensasUsuario(id_usuario)
    * Devuelve medallas y logros del usuario.
