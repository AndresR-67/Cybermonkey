Proyecto: Sistema de gestión de actividades + gamificación

- Autenticación:
    * Registro y login de usuarios.
    * Control de roles (usuario/administrador).
  
- Módulo de Actividades:
    * Crear, listar, completar y eliminar actividades.
    * Cada actividad tiene prioridad (baja/mediana/alta).
  
- Módulo de Gamificación:
    * Otorgar XP al completar actividades según prioridad:
        - Baja: 5 XP
        - Media: 10 XP
        - Alta: 15 XP
    * Otorgar XP manual (solo admin)
    * Aplicar penalizaciones
    * Gestionar rachas diarias
    * Asignar medallas y logros
    * Registrar logs de gamificación en MongoDB para histórico

- Base de Datos:
    * PostgreSQL para usuarios, actividades, recompensas, niveles.
    * MongoDB para logs de gamificación (recompensas, penalizaciones, rachas).
