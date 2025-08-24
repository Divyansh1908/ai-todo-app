import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
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
  private client: AxiosInstance

  constructor() {
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for logging or adding auth tokens
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor for centralized error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        console.error('API response error:', error.response?.data || error.message)
        
        // Handle specific error status codes
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access - redirect to login')
        } else if (error.response?.status === 403) {
          // Handle forbidden access
          console.error('Forbidden access')
        } else if (typeof error.response?.status === 'number' && error.response.status >= 500) {
          // Handle server errors
          console.error('Server error occurred')
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic error handler
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message || 'An error occurred'
      throw new ApiError(message, error.response?.status)
    }
    throw new ApiError('An unknown error occurred')
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
    try {
      const response = await this.client.get(`/todos`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get a single todo by ID
  async getTodoById(id: string): Promise<Todo> {
    try {
      const response = await this.client.get(`/todos/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Create a new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await this.client.post('/todos', todo)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Update a todo
  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await this.client.put(`/todos/${id}`, updates)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      await this.client.delete(`/todos/${id}`)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get todos by status
  async getTodosByStatus(
    status: 'todo' | 'in-progress' | 'completed', 
    page = 1, 
    limit = 50
  ): Promise<{
    todos: Todo[]
    status: string
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const response = await this.client.get(`/todos/status/${status}`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Get todos by category
  async getTodosByCategory(
    category: string, 
    page = 1, 
    limit = 50
  ): Promise<{
    todos: Todo[]
    category: string
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const response = await this.client.get(`/todos/category/${encodeURIComponent(category)}`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await this.client.get('/health')
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Batch operations
  async batchUpdateTodos(updates: Array<{ id: string; updates: UpdateTodoRequest }>): Promise<Todo[]> {
    try {
      const response = await this.client.post('/todos/batch-update', { updates })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Search todos
  async searchTodos(query: string, page = 1, limit = 50): Promise<{
    todos: Todo[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const response = await this.client.get('/todos/search', {
        params: { q: query, page, limit }
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }
}

export const apiService = new ApiService()
export default apiService

// Enhanced API error class
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
    
    let errorMessage = 'An unknown error occurred'
    
    if (error instanceof ApiError) {
      errorMessage = error.message
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return { 
      error: errorMessage,
      loading: false
    }
  }
}

// Utility function for retry logic
export async function withRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }
      
      // Don't retry on client errors (4xx)
      if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
        break
      }
      
      console.warn(`API call attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
  
  throw lastError
}