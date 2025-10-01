import { db } from '../config/db';
import { tasksTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export class TasksService {
    async createTask(titulo: string, descripcion?: string) {
        const newTask = {
            titulo,
            descripcion: descripcion || null,
            status: 'pendiente' as const,
        };

        const [createdTask] = await db.insert(tasksTable).values(newTask).returning();
        return createdTask;
    }

    async getAllTasks() {
        return await db.select().from(tasksTable).orderBy(tasksTable.fechaCreacion);
    }

    async getTaskById(id: number) {
        const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, id));

        if (!task) {
            throw new Error('Tarea no encontrada');
        }

        return task;
    }

    async updateTaskStatus(id: number, status: string) {
        const [updatedTask] = await db
            .update(tasksTable)
            .set({
                status: status as 'pendiente' | 'completada' | 'en_progreso',
                fechaActualizacion: new Date()
            })
            .where(eq(tasksTable.id, id))
            .returning();

        if (!updatedTask) {
            throw new Error('Tarea no encontrada');
        }

        return updatedTask;
    }

    async deleteTask(id: number) {
        const [deletedTask] = await db
            .delete(tasksTable)
            .where(eq(tasksTable.id, id))
            .returning();

        if (!deletedTask) {
            throw new Error('Tarea no encontrada');
        }

        return { id: deletedTask.id };
    }

    async taskExists(id: number) {
        const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
        return !!task;
    }
}

export default new TasksService();
