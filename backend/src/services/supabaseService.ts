import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Database types
export interface DatabaseTodo {
  id: string
  title: string
  description: string | null
  completed: boolean
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  category: string
  due_date: string | null
  created_at: string
  updated_at: string
}

// Database interface for type safety
export interface Database {
  public: {
    Tables: {
      todos: {
        Row: DatabaseTodo
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          status?: 'todo' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          category?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          title?: string
          description?: string | null
          completed?: boolean
          status?: 'todo' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          category?: string
          due_date?: string | null
          created_at?: never
          updated_at?: never
        }
      }
    }
  }
}

class SupabaseService {
  private static instance: SupabaseService
  private supabase: SupabaseClient

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
      )
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  public getClient(): SupabaseClient {
    return this.supabase
  }

  // Test database connection
  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('todos')
        .select('count(*)', { count: 'exact', head: true })

      if (error) {
        console.error('Database connection test failed:', error.message)
        return false
      }

      console.log('Database connection successful')
      return true
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  }

  // Utility method to handle Supabase errors
  public handleError(error: any): Error {
    if (error?.message) {
      return new Error(error.message)
    }
    return new Error('An unknown database error occurred')
  }
}

export default SupabaseService