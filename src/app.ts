import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import tasksRoutes from './routes/tasks.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiSpec = JSON.parse(
    readFileSync(path.join(__dirname, 'docs/openapi.json'), 'utf8')
);

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint de verificación de salud
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Documentación de la API
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Documentación API TODO (Drizzle)'
    })
);

// Rutas de la API
app.use('/tasks', tasksRoutes);

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        message: 'API TODO en Tiempo Real (Drizzle ORM)',
        version: '1.0.0',
        documentation: '/docs',
        health: '/health'
    });
});

// Manejo básico de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error del servidor' });
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;
