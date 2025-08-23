import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '../middleware/validation'
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByStatus,
  getTodosByCategory
} from '../controllers/todoController'

const router = Router()

router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  getAllTodos
)

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
    body('status').isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('category').trim().notEmpty().withMessage('Category is required'),
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
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
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

// Additional routes for filtering
router.get('/status/:status',
  [
    param('status').isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  getTodosByStatus
)

router.get('/category/:category',
  [
    param('category').trim().notEmpty().withMessage('Category is required'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  getTodosByCategory
)

export default router