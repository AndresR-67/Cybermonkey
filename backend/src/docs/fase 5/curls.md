Login de usuario normal (Abbacchio)

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "abbacchio@example.com",
    "contrasena": "purplehaze"
  }'


Crear una tarea

curl -X POST http://localhost:3000/api/actividades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Patrulla matutina",
    "descripcion": "Revisión de los alrededores del puerto.",
    "fecha_limite": "2025-11-05",
    "prioridad": "media"
  }'



crear nota

curl -X POST http://localhost:3000/api/notas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_actividad": 7,
    "contenido": "El informe debe incluir detalles sobre el movimiento sospechoso."
  }'



completar tarea

curl -X PATCH http://localhost:3000/api/actividades/7/completar \
  -H "Authorization: Bearer $TOKEN"


listar pendientes

curl -X GET http://localhost:3000/api/actividades?estado=pendiente \
  -H "Authorization: Bearer $TOKEN"


consultar xp gamifi

curl -X GET http://localhost:3000/api/usuarios/perfil \
  -H "Authorization: Bearer $TOKEN"


borrar actividad

curl -X DELETE http://localhost:3000/api/actividades/7 \
  -H "Authorization: Bearer $TOKEN"


consultar historial 

curl -X GET http://localhost:3000/api/historial \
  -H "Authorization: Bearer $TOKEN"



dar xp manual

curl -X POST http://localhost:3000/api/gamificacion/recompensa \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 10,
    "xp": 50
  }'



dar/quitar medallas y logros

curl -X POST http://localhost:3000/api/gamificacion/medalla \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 10,
    "id_medalla": 2
  }'
