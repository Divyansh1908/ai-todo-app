import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo'
import SupabaseService, { DatabaseTodo } from '../services/supabaseService'

const supabaseService = SupabaseService.getInstance()
const supabase = supabaseService.getClient()

// Helper function to convert database row to Todo interface
const convertDatabaseTodoToTodo = (dbTodo: DatabaseTodo): Todo => ({
  id: dbTodo.id,
  title: dbTodo.title,
  description: dbTodo.description || undefined,
  completed: dbTodo.completed,
  status: dbTodo.status,
  priority: dbTodo.priority,
  category: dbTodo.category,
  dueDate: dbTodo.due_date || undefined,
  createdAt: dbTodo.created_at,
  updatedAt: dbTodo.updated_at
})

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    // Get todos with pagination
    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching todos:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    const todos = data?.map(convertDatabaseTodoToTodo) || []

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
    console.error('Unexpected error in getAllTodos:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Todo not found' })
        return
      }
      console.error('Error fetching todo:', error)
      res.status(500).json({ error: 'Failed to fetch todo' })
      return
    }

    const todo = convertDatabaseTodoToTodo(data)
    res.json(todo)
  } catch (error) {
    console.error('Unexpected error in getTodoById:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate, category, status }: CreateTodoRequest = req.body

    const newTodo = {
      id: uuidv4(),
      title,
      description: description || null,
      completed: status === 'completed',
      status: status || 'todo',
      priority,
      category,
      due_date: dueDate || null
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()
      .single()

    if (error) {
      console.error('Error creating todo:', error)
      res.status(500).json({ error: 'Failed to create todo' })
      return
    }

    const todo = convertDatabaseTodoToTodo(data)
    res.status(201).json(todo)
  } catch (error) {
    console.error('Unexpected error in createTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updates: UpdateTodoRequest = req.body

    // Prepare update object
    const updateData: any = {}
    
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate

    // Ensure consistency between completed and status
    if (updates.completed !== undefined) {
      updateData.status = updates.completed ? 'completed' : 'todo'
    }
    if (updates.status === 'completed') {
      updateData.completed = true
    } else if (updates.status && (updates.status === 'todo' || updates.status === 'in-progress')) {
      updateData.completed = false
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Todo not found' })
        return
      }
      console.error('Error updating todo:', error)
      res.status(500).json({ error: 'Failed to update todo' })
      return
    }

    const todo = convertDatabaseTodoToTodo(data)
    res.json(todo)
  } catch (error) {
    console.error('Unexpected error in updateTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
      res.status(500).json({ error: 'Failed to delete todo' })
      return
    }

    res.status(204).send()
  } catch (error) {
    console.error('Unexpected error in deleteTodo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Additional endpoint to get todos by status
export const getTodosByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching todos by status:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    const todos = data?.map(convertDatabaseTodoToTodo) || []

    res.json({
      todos,
      status,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in getTodosByStatus:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Additional endpoint to get todos by category
export const getTodosByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('todos')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching todos by category:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }

    const todos = data?.map(convertDatabaseTodoToTodo) || []

    res.json({
      todos,
      category,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error in getTodosByCategory:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}