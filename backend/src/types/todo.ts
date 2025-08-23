export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoRequest {
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  status?: 'todo' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: string
}