import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from '../config/db';
import { tasksTable } from '../db/schema';

export const initializeSocketIO = (server: HTTPServer) => {
    const io = new SocketIOServer(server);

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('getTasks', async () => {
            try {
                const tasks = await db.select().from(tasksTable).orderBy(tasksTable.fechaCreacion);
                socket.emit('allTasks', tasks);
            } catch (error) {
                socket.emit('error', { message: 'Error al obtener las tareas' });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('Cliente desconectado:', socket.id, 'razón:', reason);
        });
    });

    return io;
};
