# Crear actividad
curl -X POST http://localhost:3000/api/actividades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Revisar estadísticas",
    "descripcion": "Analizar rendimiento del módulo de usuario"
  }'

# Listar actividades
curl -X GET http://localhost:3000/api/actividades \
  -H "Authorization: Bearer $TOKEN"

# Actualizar actividad
curl -X PUT http://localhost:3000/api/actividades/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Revisión final de estadísticas",
    "descripcion": "Corregir formato de los reportes"
  }'

# Eliminar actividad
curl -X DELETE http://localhost:3000/api/actividades/2 \
  -H "Authorization: Bearer $TOKEN"


# Crear nota
curl -X POST http://localhost:3000/api/actividades/2/notas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contenido": "Recordar revisar el apartado de estadísticas"
  }'

# Obtener notas por actividad
curl -X GET http://localhost:3000/api/actividades/2/notas \
  -H "Authorization: Bearer $TOKEN"


# Ver historial de usuario
curl -X GET http://localhost:3000/api/historial \
  -H "Authorization: Bearer $TOKEN"
