'use client'

import { RefreshCw, Plus, BarChart3 } from 'lucide-react'
import { CreateTodoRequest } from '@/types/todo'
import { AddTodoForm } from '@/components/AddTodoForm'
import { TodoList } from '@/components/TodoList'
import { Clock } from '@/components/Clock'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/sampleData'
import { useTodos } from '@/hooks/useTodos'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import MainLayout from '@/components/MainLayout'

export default function TodosPage() {
  const { 
    todos, 
    loading, 
    error, 
    createTodo, 
    updateTodo, 
    deleteTodo,
    refreshTodos 
  } = useTodos()
  
  const { isOverdue } = useCurrentTime()

  const handleAddTodo = async (todoRequest: CreateTodoRequest) => {
    try {
      await createTodo(todoRequest)
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    inProgress: todos.filter(t => t.status === 'in-progress').length,
    overdue: todos.filter(t => isOverdue(t.dueDate || null, t.completed)).length
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div>
                <h1>Todo List</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your tasks and stay organized
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <Clock />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats display */}
              <div className="hidden sm:flex items-center gap-4 text-sm bg-card border rounded-lg px-4 py-2 card-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{stats.completed} Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>{stats.inProgress} In Progress</span>
                </div>
                {stats.overdue > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{stats.overdue} Overdue</span>
                  </div>
                )}
              </div>
              
              {/* <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="focus-ring interactive">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshTodos}
                  disabled={loading}
                  className="focus-ring interactive"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div> */}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="text-red-800 font-medium">Error</div>
              </div>
              <div className="text-red-600 text-sm mt-1">{error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshTodos}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Tasks</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <span className="font-medium text-green-600">{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Progress</span>
                  <span className="font-medium text-blue-600">{stats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending</span>
                  <span className="font-medium text-gray-600">
                    {stats.total - stats.completed - stats.inProgress}
                  </span>
                </div>
                {stats.overdue > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-red-600">Overdue</span>
                    <span className="font-medium text-red-600">{stats.overdue}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Progress</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.slice(0, 6).map(category => {
                  const count = todos.filter(t => t.category === category).length
                  return (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span>{category}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <AddTodoForm 
              onAddTodo={handleAddTodo}
              categories={categories}
            />
            
            <TodoList
              todos={todos}
              onUpdateTodo={updateTodo}
              onDeleteTodo={deleteTodo}
              categories={categories}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}