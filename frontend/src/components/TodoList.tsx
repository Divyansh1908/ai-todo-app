'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, ArrowUpDown } from 'lucide-react'
import { Todo, FilterStatus, SortOption } from '@/types/todo'
import { TodoItem } from './TodoItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface TodoListProps {
  todos: Todo[]
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  onDeleteTodo: (id: string) => Promise<void>
  categories: string[]
  loading?: boolean
}

export function TodoList({ todos, onUpdateTodo, onDeleteTodo, categories, loading = false }: TodoListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos.filter(todo => {
      // Search filter
      const matchesSearch = !searchQuery || 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || todo.status === statusFilter
      
      // Priority filter
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      
      if (sortBy === 'dueDate') {
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
      } else if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
      } else if (sortBy === 'title') {
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [todos, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder])

  const toggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getStatusCounts = () => {
    return {
      all: todos.length,
      todo: todos.filter(t => t.status === 'todo').length,
      'in-progress': todos.filter(t => t.status === 'in-progress').length,
      completed: todos.filter(t => t.status === 'completed').length
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status as FilterStatus)}
              className="flex items-center gap-2"
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              <span className="bg-background/20 px-1.5 py-0.5 rounded-full text-xs">
                {count}
              </span>
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('title')}
              className={cn(
                "flex items-center gap-1",
                sortBy === 'title' && "bg-accent"
              )}
            >
              Title
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('priority')}
              className={cn(
                "flex items-center gap-1",
                sortBy === 'priority' && "bg-accent"
              )}
            >
              Priority
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('dueDate')}
              className={cn(
                "flex items-center gap-1",
                sortBy === 'dueDate' && "bg-accent"
              )}
            >
              Due Date
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedTodos.length} of {todos.length} todos
        {sortBy && (
          <span className="ml-2">
            · Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
          </span>
        )}
      </div>

      {/* Todo Items */}
      {filteredAndSortedTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            {todos.length === 0 ? 'No todos yet' : 'No todos match your filters'}
          </div>
          <div className="text-sm text-muted-foreground">
            {todos.length === 0 
              ? 'Create your first todo to get started' 
              : 'Try adjusting your search or filters'}
          </div>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        )}>
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  )
}