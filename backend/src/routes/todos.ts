import { Router } from 'express'
import { body, param } from 'express-validator'
import { validateRequest } from '../middleware/validation'
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController'

const router = Router()

router.get('/', getAllTodos)

router.get(
  '/:id',
  param('id').isUUID().withMessage('Invalid todo ID'),
  validateRequest,
  getTodoById
)

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date')
  ],
  validateRequest,
  createTodo
)

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid todo ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date')
  ],
  validateRequest,
  updateTodo
)

router.delete(
  '/:id',
  param('id').isUUID().withMessage('Invalid todo ID'),
  validateRequest,
  deleteTodo
)

export default router