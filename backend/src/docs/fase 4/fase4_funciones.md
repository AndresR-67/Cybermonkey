createActividad: crea una nueva actividad vinculada al usuario autenticado.

getActividades: devuelve todas las actividades creadas por el usuario.

updateActividad: actualiza título y descripción de una actividad existente.

deleteActividad: elimina una actividad e intenta registrar la acción en historial

Ubicación: src/controllers/actividadController.js
-------------------------------------------
notasController.js

createNota: añade una nueva nota en MongoDB vinculada a una actividad (PostgreSQL).

getNotasPorActividad: obtiene todas las notas asociadas a una actividad específica.

Ubicación: src/controllers/notasController.js
------------------------------------------------

historialModel.js

createHistorial: registra una acción (crear, editar, eliminar) asociada a un usuario y una actividad.

Ubicación: src/models/historialModel.js

------------------------------

