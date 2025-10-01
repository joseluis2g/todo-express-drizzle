# TODO Real-time API (Drizzle ORM)

API de gestión de tareas en tiempo real desarrollada con Node.js, Express 5, Drizzle ORM, SQLite y Socket.IO.

## Características

- **API REST** completa para gestión de tareas
- **WebSockets** en tiempo real con Socket.IO
- **Base de datos SQLite** con Drizzle ORM
- **Validación** de datos con express-validator
- **Documentación** automática con Swagger UI
- **Frontend** simple para pruebas
- **Seguridad básica**
- **Manejo de errores** centralizado
- **TypeScript** para tipado estático

## Requisitos Previos

- Node.js 20 o superior
- npm o yarn

## Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno (OBLIGATORIO):**

```bash
# Linux/Mac
cp env.example .env

# Windows
copy env.example .env
```

> **Importante:** Sin el archivo `.env`, el servidor usará valores por defecto pero es recomendable crearlo.

Editar el archivo `.env` con tus configuraciones:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=file:database.sqlite
```

## Configuración de la Base de Datos

La base de datos se crea automáticamente al ejecutar el servidor. Si necesitas aplicar el esquema manualmente:

```bash
# Aplicar el esquema directamente a la base de datos (recomendado)
npm run db:push

# O alternativamente, generar y aplicar migraciones
npm run db:generate
npm run db:migrate
```

### Migraciones de Base de Datos

El proyecto utiliza **Drizzle ORM** para gestionar las migraciones de la base de datos. La carpeta `drizzle/` contiene:

- **Archivos SQL de migración** (`*.sql`) - Contienen los comandos SQL para crear/modificar la estructura
- **Metadatos** (`meta/`) - Información sobre el historial de migraciones y snapshots del esquema

#### Estructura de la carpeta `drizzle/`:
```
drizzle/
├── 0000_flat_mentallo.sql    # Migración inicial con CREATE TABLE
└── meta/
    ├── _journal.json         # Diario de migraciones aplicadas
    └── 0000_snapshot.json    # Snapshot del esquema en formato JSON
```

#### ¿Por qué incluir la carpeta `drizzle/` en el repositorio?
- **Versionado**: Cada cambio en el esquema genera una nueva migración
- **Colaboración**: Otros desarrolladores pueden aplicar las mismas migraciones
- **Despliegue**: Permite aplicar cambios de forma controlada en producción
- **Historial**: Mantiene un registro de todos los cambios en la base de datos

**Nota:** El archivo `database.sqlite` se genera automáticamente y no debe incluirse en el repositorio.

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Documentación de la API

Una vez iniciado el servidor, puedes acceder a la documentación interactiva en:

- **Swagger UI:** http://localhost:3000/docs
- **Frontend de prueba:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## Endpoints de la API

### Tareas

| Método   | Endpoint     | Descripción                |
| -------- | ------------ | -------------------------- |
| `GET`    | `/tasks`     | Obtener todas las tareas   |
| `POST`   | `/tasks`     | Crear nueva tarea          |
| `GET`    | `/tasks/:id` | Obtener tarea por ID       |
| `PUT`    | `/tasks/:id` | Actualizar estado de tarea |
| `DELETE` | `/tasks/:id` | Eliminar tarea             |

### Ejemplos de uso con curl

**Crear una tarea:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Completar documentación",
    "descripcion": "Escribir documentación completa del proyecto"
  }'
```

**Obtener todas las tareas:**

```bash
curl http://localhost:3000/tasks
```

**Actualizar estado de tarea:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completada"}'
```

**Eliminar tarea:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Eventos WebSocket

La API emite los siguientes eventos en tiempo real:

- **`newTask`** - Nueva tarea creada
- **`taskUpdated`** - Tarea actualizada
- **`taskDeleted`** - Tarea eliminada

### Conexión WebSocket

```javascript
const socket = io('http://localhost:3000');

socket.on('newTask', task => {
  console.log('Nueva tarea:', task);
});

socket.on('taskUpdated', data => {
  console.log('Tarea actualizada:', data);
});

socket.on('taskDeleted', data => {
  console.log('Tarea eliminada:', data);
});
```

## Estructura de la Base de Datos

### Tabla `tasks`

| Campo                | Tipo    | Descripción                                |
| -------------------- | ------- | ------------------------------------------ |
| `id`                 | INTEGER | Clave primaria (autoincremental)           |
| `titulo`             | TEXT    | Título de la tarea (máx. 100 caracteres)   |
| `descripcion`        | TEXT    | Descripción opcional (máx. 500 caracteres) |
| `status`             | TEXT    | Estado: 'pendiente', 'en_progreso' o 'completada' |
| `fechaCreacion`      | TEXT    | Fecha de creación (ISO 8601)               |
| `fechaActualizacion` | TEXT    | Fecha de última actualización (ISO 8601)   |

## Estructura del Proyecto

```
todo-express-drizzle/
├── src/
│   ├── app.ts                 # Configuración de Express
│   ├── index.ts               # Servidor principal
│   ├── config/
│   │   └── db.ts             # Configuración de base de datos
│   ├── db/
│   │   ├── index.ts          # Configuración Drizzle
│   │   └── schema.ts         # Esquema de la base de datos
│   ├── routes/
│   │   └── tasks.routes.ts   # Rutas de tareas
│   ├── controllers/
│   │   └── tasks.controller.ts # Controladores
│   ├── services/
│   │   └── tasks.service.ts  # Lógica de negocio
│   ├── sockets/
│   │   └── io.ts             # Configuración Socket.IO
│   ├── middlewares/
│   │   ├── errorHandler.ts   # Manejo de errores
│   │   └── validators.ts     # Validaciones
│   └── docs/
│       └── openapi.json      # Documentación Swagger
├── public/
│   └── index.html            # Frontend de prueba
├── drizzle/
│   ├── 0000_flat_mentallo.sql
│   └── meta/
│       ├── _journal.json
│       └── 0000_snapshot.json
├── .env.example              # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── README.md
```

## Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo con tsx
npm run build    # Compilar TypeScript
npm start        # Ejecutar en modo producción
npm run format   # Formatear código con Prettier
npm run db:push  # Aplicar esquema directamente a la base de datos
npm run db:generate # Generar archivos de migración
npm run db:migrate # Aplicar migraciones generadas
```

## Configuración

### Variables de Entorno

| Variable                  | Descripción                    | Valor por defecto     |
| ------------------------- | ------------------------------ | --------------------- |
| `PORT`                    | Puerto del servidor            | 3000                  |
| `NODE_ENV`                | Entorno de ejecución           | development           |
| `DATABASE_URL`            | URL de la base de datos        | file:database.sqlite  |

## Pruebas

### Pruebas de API

1. **Crear tarea:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Tarea de prueba"}'
```

2. **Listar tareas:**

```bash
curl http://localhost:3000/tasks
```

3. **Actualizar tarea:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completada"}'
```

### Pruebas de WebSocket

Puedes usar el frontend incluido en `http://localhost:3000` o herramientas como `wscat`:

```bash
npm install -g wscat
wscat -c ws://localhost:3000
```

## Notas para la Prueba

Este proyecto está diseñado para ser una demostración de habilidades en:

- **Node.js y Express 5** - Framework web moderno
- **Drizzle ORM** - ORM moderno con TypeScript
- **SQLite** - Base de datos ligera y portable
- **WebSockets** - Comunicación en tiempo real
- **TypeScript** - Tipado estático para mejor desarrollo
- **Validación de datos** - Seguridad y robustez
- **Arquitectura limpia** - Separación de responsabilidades
- **Documentación** - API bien documentada con Swagger

## Decisiones de Diseño

- **Drizzle ORM**: Elegido por su tipado fuerte y simplicidad con TypeScript
- **Express 5**: Versión más moderna con mejor rendimiento
- **SQLite**: Elegido por simplicidad y facilidad de despliegue
- **Express-validator**: Para validación robusta de datos
- **Arquitectura en capas**: Separación clara de responsabilidades
- **WebSockets**: Para actualizaciones en tiempo real
- **Swagger**: Documentación automática y interactiva
- **Manejo de errores centralizado**: Respuestas consistentes

## Diferencias con la versión SQLite nativa

Esta versión utiliza **Drizzle ORM** en lugar de SQLite nativo, lo que proporciona:

- **Tipado estático** con TypeScript
- **Migraciones** automáticas y versionadas
- **Query builder** más intuitivo
- **Mejor integración** con TypeScript
- **Validación de esquemas** en tiempo de compilación

## Instrucciones de Entrega

Para entregar esta prueba:

1. **Zipear el proyecto** completo
2. **Incluir README** con instrucciones de instalación
3. **Documentar** las decisiones técnicas tomadas
4. **Probar** que funcione correctamente con `npm run dev`

## Consideraciones Técnicas

- **Arquitectura en capas**: Controladores, servicios, rutas separados
- **TypeScript**: Tipado estático para mejor desarrollo
- **Drizzle ORM**: Migraciones y esquemas versionados
- **Manejo de errores**: Centralizado y consistente
- **Validación**: Datos de entrada validados
- **WebSockets**: Actualizaciones en tiempo real
- **Documentación**: Swagger UI para probar la API
