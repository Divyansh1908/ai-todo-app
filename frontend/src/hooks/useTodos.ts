'use client'

import { useState, useEffect, useCallback } from 'react'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'
import { apiService } from '@/services/api'

interface UseTodosReturn {
  todos: Todo[]
  loading: boolean
  error: string | null
  createTodo: (todo: CreateTodoRequest) => Promise<void>
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  refreshTodos: () => Promise<void>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
  } | null>(null)

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getAllTodos()
      setTodos(response.todos)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTodo = useCallback(async (todoRequest: CreateTodoRequest) => {
    try {
      setError(null)
      const newTodo = await apiService.createTodo(todoRequest)
      
      // Optimistic update
      setTodos(prev => [newTodo, ...prev])
      
      // Update pagination
      if (pagination) {
        setPagination(prev => prev ? { ...prev, total: prev.total + 1 } : null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo')
      console.error('Error creating todo:', err)
      throw err
    }
  }, [pagination])

  const updateTodo = useCallback(async (id: string, updates: UpdateTodoRequest) => {
    try {
      setError(null)
      
      // Optimistic update
      setTodos(prev => prev.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              ...updates, 
              // Ensure consistency between completed and status
              completed: updates.status === 'completed' ? true : (updates.completed ?? todo.completed),
              status: updates.completed !== undefined 
                ? (updates.completed ? 'completed' : 'todo')
                : (updates.status ?? todo.status),
              updatedAt: new Date().toISOString()
            }
          : todo
      ))
      
      // Make API call
      const updatedTodo = await apiService.updateTodo(id, updates)
      
      // Update with actual response
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      console.error('Error updating todo:', err)
      // Revert optimistic update on error
      await fetchTodos()
      throw err
    }
  }, [fetchTodos])

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null)
      
      // Optimistic update
      setTodos(prev => prev.filter(todo => todo.id !== id))
      
      // Update pagination
      if (pagination) {
        setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : null)
      }
      
      // Make API call
      await apiService.deleteTodo(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      console.error('Error deleting todo:', err)
      // Revert optimistic update on error
      await fetchTodos()
      throw err
    }
  }, [fetchTodos, pagination])

  const refreshTodos = useCallback(async () => {
    await fetchTodos()
  }, [fetchTodos])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refreshTodos,
    pagination
  }
}