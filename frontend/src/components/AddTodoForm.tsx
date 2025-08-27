'use client'

import { useState } from 'react'
import { Plus, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateTodoRequest } from '@/types/todo'
import { cn } from '@/lib/utils'

interface AddTodoFormProps {
  onAddTodo: (todo: CreateTodoRequest) => void
  categories: string[]
}

export function AddTodoForm({ onAddTodo, categories }: AddTodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'General',
    dueDate: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.dueDate ) {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
        // Set selected date to END of day (11:59:59 PM)
      selectedDate.setHours(23, 59, 59, 999)
      
      // Compare: Is the END of selected day before current time?
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date must be today or later'
      }
    } 
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onAddTodo({
      ...formData,
      description: formData.description || undefined,
      dueDate: formData.dueDate || undefined
    })
    
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'General',
      dueDate: ''
    })
    setIsExpanded(false)
    setErrors({})
  }

  const handleAiEnhance = () => {
    // Placeholder for AI enhancement functionality
    alert('AI enhancement feature coming soon!')
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4 card-shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onFocus={() => setIsExpanded(true)}
            className={cn(
              "text-base transition-all duration-200",
              errors.title && "border-red-500 focus:border-red-500"
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <Textarea
                placeholder="Add a description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className={cn(
                    errors.category && "border-red-500"
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(
                    errors.dueDate && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: 'todo' | 'in-progress' | 'completed') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 focus-ring interactive">
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAiEnhance}
                className="px-4 focus-ring interactive"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Enhance
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsExpanded(false)
                  setFormData({
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium',
                    category: 'General',
                    dueDate: ''
                  })
                  setErrors({})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {!isExpanded && formData.title && (
          <Button type="submit" className="w-full focus-ring interactive">
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        )}
      </form>
    </div>
  )
}