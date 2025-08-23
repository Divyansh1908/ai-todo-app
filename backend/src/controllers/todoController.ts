import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo'

let todos: Todo[] = []

export const getAllTodos = (req: Request, res: Response): void => {
  res.json(todos)
}

export const getTodoById = (req: Request, res: Response): void => {
  const { id } = req.params
  const todo = todos.find(t => t.id === id)
  
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  
  res.json(todo)
}

export const createTodo = (req: Request, res: Response): void => {
  const { title, description, priority, dueDate }: CreateTodoRequest = req.body
  
  const newTodo: Todo = {
    id: uuidv4(),
    title,
    description,
    completed: false,
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  todos.push(newTodo)
  res.status(201).json(newTodo)
}

export const updateTodo = (req: Request, res: Response): void => {
  const { id } = req.params
  const updates: UpdateTodoRequest = req.body
  
  const todoIndex = todos.findIndex(t => t.id === id)
  
  if (todoIndex === -1) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  
  todos[todoIndex] = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  res.json(todos[todoIndex])
}

export const deleteTodo = (req: Request, res: Response): void => {
  const { id } = req.params
  const todoIndex = todos.findIndex(t => t.id === id)
  
  if (todoIndex === -1) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  
  todos.splice(todoIndex, 1)
  res.status(204).send()
}