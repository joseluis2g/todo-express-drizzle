import 'dotenv/config';
import { createServer } from 'http';
import { initializeSocketIO } from './sockets/io.js';
import { db } from './config/db.js';
import { tasksTable } from './db/schema.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(server);

// Make io available to the app
app.set('io', io);

// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        await db.select().from(tasksTable).limit(1);

        // Start server
        server.listen(PORT, () => {
            console.log(`Servidor ejecutándose en puerto ${PORT}`);
            console.log(`Documentación API: http://localhost:${PORT}/docs`);
            console.log(`Verificación de Salud: http://localhost:${PORT}/health`);
            console.log(`WebSocket: ws://localhost:${PORT}`);
            console.log(`Frontend: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('Proceso terminado');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido, cerrando servidor...');
    server.close(() => {
        console.log('Proceso terminado');
    });
});

// Start the server
startServer();
