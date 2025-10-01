import { Router } from 'express';
import tasksController from '../controllers/tasks.controller';
import { validateCreateTask, validateUpdateTask, validateTaskId } from '../middlewares/validators';

const router = Router();

// Create a new task
router.post('/', validateCreateTask, tasksController.createTask);

// Get all tasks
router.get('/', tasksController.getAllTasks);

// Get task by ID
router.get('/:id', validateTaskId, tasksController.getTaskById);

// Update task status
router.put('/:id', validateUpdateTask, tasksController.updateTaskStatus);

// Delete task
router.delete('/:id', validateTaskId, tasksController.deleteTask);

export default router;
