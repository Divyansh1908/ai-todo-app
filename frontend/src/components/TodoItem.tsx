'use client'

import { useState } from 'react'
import { Calendar, Edit2, Trash2, Clock } from 'lucide-react'
import { Todo } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn, formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')

  const handleSave = async () => {
    try {
      await onUpdate(todo.id, {
        title: editTitle,
        description: editDescription
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  const handleToggleComplete = async () => {
    try {
      await onUpdate(todo.id, { 
        completed: !todo.completed,
        status: !todo.completed ? 'completed' : 'todo'
      })
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <div className={cn(
      "group relative bg-card border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
      todo.completed && "opacity-75",
      isOverdue && "border-red-200 bg-red-50/50"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-0.5 transition-transform hover:scale-110"
        />
        
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="font-medium"
                placeholder="Todo title"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h3 className={cn(
                  "font-medium transition-colors",
                  todo.completed && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    todo.completed && "line-through"
                  )}>
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                  getPriorityColor(todo.priority)
                )}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
                
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(todo.status)
                )}>
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).replace('-', ' ')}
                </span>

                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {todo.category}
                </span>

                {todo.dueDate && (
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    isOverdue 
                      ? "bg-red-100 text-red-800 border border-red-200" 
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  )}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(todo.dueDate)}
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDate(todo.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                try {
                  await onDelete(todo.id)
                } catch (error) {
                  console.error('Failed to delete todo:', error)
                }
              }}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}