import { Request, Response } from 'express' // Import Express types for request and response handling
import { v4 as uuidv4 } from 'uuid' // Import UUID generator for creating unique IDs
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo' // Import type definitions
import SupabaseService, { DatabaseTodo } from '../services/supabaseService' // Import database service

// Initialize Supabase client using singleton pattern to ensure only one instance exists
const supabaseService = SupabaseService.getInstance()
const supabase = supabaseService.getClient()

/**
 * Helper function to convert database row to Todo interface
 * This maps snake_case database fields to camelCase API fields
 * and handles null values by converting them to undefined where appropriate
 */
const convertDatabaseTodoToTodo = (dbTodo: DatabaseTodo): Todo => ({
  id: dbTodo.id,
  title: dbTodo.title,
  description: dbTodo.description || undefined, // Convert null to undefined for optional fields
  completed: dbTodo.completed,
  status: dbTodo.status,
  priority: dbTodo.priority,
  category: dbTodo.category,
  dueDate: dbTodo.due_date || undefined, // Convert snake_case to camelCase
  createdAt: dbTodo.created_at, // Convert snake_case to camelCase
  updatedAt: dbTodo.updated_at // Convert snake_case to camelCase
})

/**
 * Get all todos with pagination
 * @param req - Express request object containing query parameters
 * @param res - Express response object
 */
export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit // Calculate offset for pagination

    // Query todos with pagination, ordering by created_at in descending order
    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' }) // Get exact count for pagination
      .order('created_at', { ascending: false }) // Sort newest first
      .range(offset, offset + limit - 1) // Apply pagination

    // Handle database error
    if (error) {
      console.error('Error fetching todos:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    // Convert database rows to Todo interface objects
    const todos = data?.map(convertDatabaseTodoToTodo) || []

    // Return todos with pagination metadata
    res.json({
      todos,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in getAllTodos:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get a specific todo by ID
 * @param req - Express request object containing the todo ID in params
 * @param res - Express response object
 */
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract todo ID from request parameters
    const { id } = req.params

    // Query the specific todo by ID
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id) // Filter by ID
      .single() // Expect a single result

    // Handle errors, distinguishing between "not found" and other errors
    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for "not found"
        res.status(404).json({ error: 'Todo not found' })
        return
      }
      console.error('Error fetching todo:', error)
      res.status(500).json({ error: 'Failed to fetch todo' })
      return
    }

    // Convert database row to Todo interface and return
    const todo = convertDatabaseTodoToTodo(data)
    res.json(todo)
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in getTodoById:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Create a new todo
 * @param req - Express request object containing the todo data in body
 * @param res - Express response object
 */
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate todo data from request body using type definition
    const { title, description, priority, dueDate, category, status }: CreateTodoRequest = req.body

    // Prepare the new todo object for database insertion
    // Converting camelCase API fields to snake_case database fields
    const newTodo = {
      id: uuidv4(), // Generate a unique ID
      title,
      description: description || null, // Convert undefined to null for database
      completed: status === 'completed', // Derive completed state from status
      status: status || 'todo', // Default status if not provided
      priority,
      category,
      due_date: dueDate || null // Convert camelCase to snake_case
    }

    // Insert the new todo and retrieve the inserted record
    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select() // Get the inserted record
      .single() // Expect a single result

    // Handle database error
    if (error) {
      console.error('Error creating todo:', error)
      res.status(500).json({ error: 'Failed to create todo' })
      return
    }

    // Convert database row to Todo interface and return with 201 Created status
    const todo = convertDatabaseTodoToTodo(data)
    res.status(201).json(todo)
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in createTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Update an existing todo
 * @param req - Express request object containing the todo ID in params and update data in body
 * @param res - Express response object
 */
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract todo ID from request parameters
    const { id } = req.params
    // Extract and validate update data from request body using type definition
    const updates: UpdateTodoRequest = req.body

    // Prepare update object, only including fields that are present in the request
    const updateData: any = {}
    
    // Conditionally add fields to update object
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate // Convert camelCase to snake_case

    // Ensure consistency between completed and status fields
    if (updates.completed !== undefined) {
      // If completed is true, set status to 'completed', otherwise 'todo'
      updateData.status = updates.completed ? 'completed' : 'todo'
    }
    if (updates.status === 'completed') {
      // If status is set to 'completed', ensure completed flag is true
      updateData.completed = true
    } else if (updates.status && (updates.status === 'todo' || updates.status === 'in-progress')) {
      // If status is set to a non-completed state, ensure completed flag is false
      updateData.completed = false
    }

    // Update the todo and retrieve the updated record
    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id) // Filter by ID
      .select() // Get the updated record
      .single() // Expect a single result

    // Handle errors, distinguishing between "not found" and other errors
    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for "not found"
        res.status(404).json({ error: 'Todo not found' })
        return
      }
      console.error('Error updating todo:', error)
      res.status(500).json({ error: 'Failed to update todo' })
      return
    }

    // Convert database row to Todo interface and return
    const todo = convertDatabaseTodoToTodo(data)
    res.json(todo)
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in updateTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Delete a todo by ID
 * @param req - Express request object containing the todo ID in params
 * @param res - Express response object
 */
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract todo ID from request parameters
    const { id } = req.params

    // Delete the todo
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id) // Filter by ID

    // Handle database error
    if (error) {
      console.error('Error deleting todo:', error)
      res.status(500).json({ error: 'Failed to delete todo' })
      return
    }

    // Return 204 No Content status indicating successful deletion with no response body
    res.status(204).send()
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in deleteTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get todos filtered by status with pagination
 * @param req - Express request object containing status in params and pagination in query
 * @param res - Express response object
 */
export const getTodosByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract status from request parameters
    const { status } = req.params
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit // Calculate offset for pagination

    // Query todos filtered by status with pagination
    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' }) // Get exact count for pagination
      .eq('status', status) // Filter by status
      .order('created_at', { ascending: false }) // Sort newest first
      .range(offset, offset + limit - 1) // Apply pagination

    // Handle database error
    if (error) {
      console.error('Error fetching todos by status:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    // Convert database rows to Todo interface objects
    const todos = data?.map(convertDatabaseTodoToTodo) || []

    // Return todos with status and pagination metadata
    res.json({
      todos,
      status, // Include the status used for filtering
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in getTodosByStatus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get todos filtered by category with pagination
 * @param req - Express request object containing category in params and pagination in query
 * @param res - Express response object
 */
export const getTodosByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract category from request parameters
    const { category } = req.params
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit // Calculate offset for pagination

    // Query todos filtered by category with pagination
    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' }) // Get exact count for pagination
      .eq('category', category) // Filter by category
      .order('created_at', { ascending: false }) // Sort newest first
      .range(offset, offset + limit - 1) // Apply pagination

    // Handle database error
    if (error) {
      console.error('Error fetching todos by category:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    // Convert database rows to Todo interface objects
    const todos = data?.map(convertDatabaseTodoToTodo) || []

    // Return todos with category and pagination metadata
    res.json({
      todos,
      category, // Include the category used for filtering
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in getTodosByCategory:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}