import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ApiResponse<T> {
  todos?: T[]
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Get all todos with pagination
  async getAllTodos(page = 1, limit = 50): Promise<{
    todos: Todo[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const response = await this.request<{
      todos: Todo[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(`/todos?page=${page}&limit=${limit}`)
    
    return response
  }

  // Get a single todo by ID
  async getTodoById(id: string): Promise<Todo> {
    return await this.request<Todo>(`/todos/${id}`)
  }

  // Create a new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    return await this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    })
  }

  // Update a todo
  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    return await this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    await this.request(`/todos/${id}`, {
      method: 'DELETE',
    })
  }

  // Get todos by status
  async getTodosByStatus(status: 'todo' | 'in-progress' | 'completed', page = 1, limit = 50): Promise<{
    todos: Todo[]
    status: string
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    return await this.request(`/todos/status/${status}?page=${page}&limit=${limit}`)
  }

  // Get todos by category
  async getTodosByCategory(category: string, page = 1, limit = 50): Promise<{
    todos: Todo[]
    category: string
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    return await this.request(`/todos/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`)
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return await this.request<{ status: string; message: string }>('/health')
  }
}

export const apiService = new ApiService()
export default apiService

// Custom hook for handling API errors
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Utility function to handle API responses with error handling
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: string; loading: boolean }> {
  try {
    const data = await apiCall()
    return { data, loading: false }
  } catch (error) {
    console.error('API Error:', error)
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      loading: false
    }
  }
}