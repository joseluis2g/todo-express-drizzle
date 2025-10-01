import { Request, Response, NextFunction } from 'express';
import tasksService from '../services/tasks.service';

export class TasksController {
    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { titulo, descripcion } = req.body;

            const task = await tasksService.createTask(titulo, descripcion);

            // Emitir evento WebSocket para nueva tarea
            req.app.get('io').emit('newTask', task);

            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async getAllTasks(_req: Request, res: Response, next: NextFunction) {
        try {
            const tasks = await tasksService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const task = await tasksService.updateTaskStatus(parseInt(id), status);

            // Emitir evento WebSocket para actualización de tarea
            req.app.get('io').emit('taskUpdated', { id: parseInt(id), status });

            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await tasksService.deleteTask(parseInt(id));

            // Emitir evento WebSocket para eliminación de tarea
            req.app.get('io').emit('taskDeleted', { id: parseInt(id) });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const task = await tasksService.getTaskById(parseInt(id));
            res.json(task);
        } catch (error) {
            next(error);
        }
    }
}

export default new TasksController();
