import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Manejador de resultados de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                message: 'Error de Validación',
                details: errors.array().map(err => ({
                    field: 'path' in err ? err.path : 'unknown',
                    message: err.msg,
                    value: 'value' in err ? err.value : undefined
                }))
            }
        });
    }
    next();
};

// Task creation validation
export const validateCreateTask = [
    body('titulo')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ max: 100 })
        .withMessage('El título debe tener máximo 100 caracteres'),
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción debe tener máximo 500 caracteres'),
    handleValidationErrors
];

// Task update validation
export const validateUpdateTask = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la tarea debe ser un entero positivo'),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('El estado es obligatorio')
        .isIn(['pendiente', 'completada', 'en_progreso'])
        .withMessage('El estado debe ser: pendiente, completada o en_progreso'),
    handleValidationErrors
];

// Task ID validation
export const validateTaskId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID de la tarea debe ser un entero positivo'),
    handleValidationErrors
];
