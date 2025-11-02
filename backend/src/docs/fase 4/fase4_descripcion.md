En esta Fase 4 se implementó el módulo de actividades, notas e historial, extendiendo la funcionalidad de los usuarios autenticados para registrar sus acciones dentro del sistema.

El propósito fue crear una capa de interacción entre los usuarios y sus tareas, con seguimiento mediante historial, y soporte para añadir notas asociadas a cada actividad.

Funcionalidades implementadas

CRUD completo para actividades (crear, listar, editar, eliminar).

CRUD completo para notas asociadas a cada actividad.

Registro de acciones en el historial (crear actividad, crear nota, eliminar, etc.).

Control de acceso mediante JWT y roles.
Integración de PostgreSQL (actividades e historial) y MongoDB (notas).
Pruebas de endpoints con curl para verificar comportamiento.